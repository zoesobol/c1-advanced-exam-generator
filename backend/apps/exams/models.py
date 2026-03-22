import uuid

from django.conf import settings
from django.db import models

from .constants import (
    DIFFICULTY_CHOICES,
    DIFFICULTY_C1_MID,
    EXAM_STATUS_CHOICES,
    EXAM_STATUS_DRAFT,
    MODE_CHOICES,
    MODE_QUALITY,
    PART_CHOICES,
    SECTION_STATUS_CHOICES,
    SECTION_STATUS_PENDING,
    SECTION_TYPE_CHOICES,
)


class Exam(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="exams",
    )
    mode = models.CharField(
        max_length=20,
        choices=MODE_CHOICES,
        default=MODE_QUALITY,
    )
    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_CHOICES,
        default=DIFFICULTY_C1_MID,
    )
    timer_enabled = models.BooleanField(default=True)
    ruoe_timer_minutes = models.PositiveIntegerField(default=90)
    writing_timer_minutes = models.PositiveIntegerField(default=90)
    uk_spelling = models.BooleanField(default=True)
    status = models.CharField(
        max_length=20,
        choices=EXAM_STATUS_CHOICES,
        default=EXAM_STATUS_DRAFT,
    )
    selected_parts = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self) -> str:
        return f"Exam {self.id} - {self.user}"


class ExamSection(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    exam = models.ForeignKey(
        Exam,
        on_delete=models.CASCADE,
        related_name="sections",
    )
    part_code = models.CharField(max_length=2, choices=PART_CHOICES)
    section_type = models.CharField(max_length=20, choices=SECTION_TYPE_CHOICES)
    status = models.CharField(
        max_length=20,
        choices=SECTION_STATUS_CHOICES,
        default=SECTION_STATUS_PENDING,
    )
    generator_version = models.CharField(max_length=100, blank=True, default="")
    content_json = models.JSONField(default=dict, blank=True)
    answer_key_json = models.JSONField(default=dict, blank=True)
    raw_model_output = models.TextField(blank=True, default="")
    prompt_log_json = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["created_at"]
        constraints = [
            models.UniqueConstraint(
                fields=["exam", "part_code"],
                name="unique_exam_part_code",
            )
        ]
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["part_code"]),
        ]

    def __str__(self) -> str:
        return f"{self.exam_id} - {self.part_code}" # type: ignore


class SectionAttempt(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.ForeignKey(
        ExamSection,
        on_delete=models.CASCADE,
        related_name="attempts",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="section_attempts",
    )
    started_at = models.DateTimeField(null=True, blank=True)
    submitted_at = models.DateTimeField()
    time_spent_seconds = models.PositiveIntegerField(default=0)
    answers_json = models.JSONField(default=dict, blank=True)
    score = models.PositiveIntegerField(default=0)
    max_score = models.PositiveIntegerField(default=0)
    results_json = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ["-submitted_at"]
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["submitted_at"]),
        ]

    def __str__(self) -> str:
        return f"Attempt {self.id} - {self.section_id}" # type: ignore
