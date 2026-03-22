from django.contrib import admin

from .models import Exam, ExamSection, SectionAttempt


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "status",
        "mode",
        "difficulty",
        "timer_enabled",
        "created_at",
    )
    list_filter = ("status", "mode", "difficulty", "timer_enabled", "uk_spelling")
    search_fields = ("id", "user__email", "user__username")
    readonly_fields = ("created_at", "updated_at")


@admin.register(ExamSection)
class ExamSectionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "exam",
        "part_code",
        "section_type",
        "status",
        "generator_version",
        "created_at",
    )
    list_filter = ("part_code", "section_type", "status")
    search_fields = ("id", "exam__id")
    readonly_fields = ("created_at", "updated_at")


@admin.register(SectionAttempt)
class SectionAttemptAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "section",
        "user",
        "score",
        "max_score",
        "submitted_at",
    )
    list_filter = ("submitted_at",)
    search_fields = ("id", "section__id", "user__email", "user__username")
