from rest_framework import serializers

from .constants import (
    DIFFICULTY_CHOICES,
    MODE_CHOICES,
    PART_CHOICES,
    sort_parts,
)
from .models import Exam, ExamSection, SectionAttempt


class ExamSectionSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExamSection
        fields = (
            "id",
            "part_code",
            "section_type",
            "status",
            "generator_version",
            "created_at",
            "updated_at",
        )


class ExamListSerializer(serializers.ModelSerializer):
    sections = ExamSectionSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = (
            "id",
            "mode",
            "difficulty",
            "timer_enabled",
            "ruoe_timer_minutes",
            "writing_timer_minutes",
            "uk_spelling",
            "status",
            "selected_parts",
            "sections",
            "created_at",
            "updated_at",
        )


class ExamDetailSerializer(serializers.ModelSerializer):
    sections = ExamSectionSummarySerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = (
            "id",
            "mode",
            "difficulty",
            "timer_enabled",
            "ruoe_timer_minutes",
            "writing_timer_minutes",
            "uk_spelling",
            "status",
            "selected_parts",
            "sections",
            "created_at",
            "updated_at",
        )


class ExamCreateSerializer(serializers.Serializer):
    selected_parts = serializers.ListField(
        child=serializers.ChoiceField(choices=[choice[0] for choice in PART_CHOICES]),
        allow_empty=False,
    )
    mode = serializers.ChoiceField(
        choices=[choice[0] for choice in MODE_CHOICES],
        default="quality",
    )
    difficulty = serializers.ChoiceField(
        choices=[choice[0] for choice in DIFFICULTY_CHOICES],
        default="c1_mid",
    )
    timer_enabled = serializers.BooleanField(default=True)
    uk_spelling = serializers.BooleanField(default=True)
    planning_help_enabled = serializers.BooleanField(required=False, default=False)

    def validate_selected_parts(self, value):
        if not value:
            raise serializers.ValidationError("At least one part must be selected.")
        return sort_parts(value)


class SectionPayloadSerializer(serializers.ModelSerializer):
    content = serializers.JSONField(source="content_json")

    class Meta:
        model = ExamSection
        fields = (
            "id",
            "exam_id",
            "part_code",
            "section_type",
            "status",
            "content",
            "created_at",
            "updated_at",
        )


class SectionSubmitSerializer(serializers.Serializer):
    answers = serializers.DictField(child=serializers.CharField(), allow_empty=False)
    time_spent_seconds = serializers.IntegerField(min_value=0)


class SectionAttemptSerializer(serializers.ModelSerializer):
    section_id = serializers.UUIDField(source="section.id")

    class Meta:
        model = SectionAttempt
        fields = (
            "id",
            "section_id",
            "score",
            "max_score",
            "results_json",
            "submitted_at",
        )
