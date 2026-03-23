from django.db import transaction
from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .constants import (
    EXAM_STATUS_COMPLETED,
    EXAM_STATUS_DRAFT,
    EXAM_STATUS_IN_PROGRESS,
    EXAM_STATUS_READY,
    PART_P1,
    PART_P2,
    SECTION_STATUS_GENERATING,
    SECTION_STATUS_PENDING,
    SECTION_STATUS_READY,
    SECTION_STATUS_SUBMITTED,
    infer_section_type,
    sort_parts,
)
from .mock_generators import generate_mock_p1, generate_mock_p2
from .models import Exam, ExamSection, SectionAttempt


def validate_selected_parts(selected_parts: list[str]) -> list[str]:
    if not selected_parts:
        raise ValidationError({"selected_parts": "At least one part must be selected."})

    try:
        normalized = sort_parts(selected_parts)
        for part in normalized:
            infer_section_type(part)
    except ValueError as exc:
        raise ValidationError({"selected_parts": str(exc)}) from exc

    return normalized


@transaction.atomic
def create_exam_for_user(
    *,
    user,
    selected_parts: list[str],
    mode: str,
    difficulty: str,
    timer_enabled: bool,
    uk_spelling: bool,
    ruoe_timer_minutes: int = 90,
    writing_timer_minutes: int = 90,
) -> Exam:
    normalized_parts = validate_selected_parts(selected_parts)

    exam = Exam.objects.create(
        user=user,
        selected_parts=normalized_parts,
        mode=mode,
        difficulty=difficulty,
        timer_enabled=timer_enabled,
        ruoe_timer_minutes=ruoe_timer_minutes,
        writing_timer_minutes=writing_timer_minutes,
        uk_spelling=uk_spelling,
        status=EXAM_STATUS_DRAFT,
    )

    sections = [
        ExamSection(
            exam=exam,
            part_code=part_code,
            section_type=infer_section_type(part_code),
            status=SECTION_STATUS_PENDING,
        )
        for part_code in normalized_parts
    ]
    ExamSection.objects.bulk_create(sections)

    return exam


@transaction.atomic
def generate_section_for_exam(*, exam: Exam, part_code: str) -> ExamSection:
    try:
        section = exam.sections.get(part_code=part_code)  # type: ignore
    except ExamSection.DoesNotExist as exc:
        raise ValidationError({"part_code": "Section not found for this exam."}) from exc

    section.status = SECTION_STATUS_GENERATING
    section.save(update_fields=["status", "updated_at"])

    if part_code == PART_P1:
        generated = generate_mock_p1()
    elif part_code == PART_P2:
        generated = generate_mock_p2()
    else:
        raise ValidationError({"part_code": f"Generation not implemented for {part_code} yet."})

    section.content_json = generated["content"]
    section.answer_key_json = generated["answer_key"]
    section.generator_version = generated["generator_version"]
    section.raw_model_output = generated["raw_model_output"]
    section.prompt_log_json = generated["prompt_log"]
    section.status = SECTION_STATUS_READY
    section.save()

    if exam.status == EXAM_STATUS_DRAFT:
        exam.status = EXAM_STATUS_READY
        exam.save(update_fields=["status", "updated_at"])

    return section


@transaction.atomic
def submit_objective_section(
    *,
    section: ExamSection,
    user,
    answers: dict,
    time_spent_seconds: int,
) -> SectionAttempt:
    if section.exam.user_id != user.id:  # type: ignore
        raise ValidationError("You do not have access to this section.")

    if not section.answer_key_json:
        raise ValidationError("This section has no answer key yet.")

    answer_key = section.answer_key_json
    results = []
    score = 0
    max_score = len(answer_key)

    for question_id, metadata in answer_key.items():
        correct_answer = metadata["correct"]
        accepted_answers = metadata.get("accepted", [correct_answer])

        raw_user_answer = answers.get(question_id)
        user_answer = raw_user_answer if isinstance(raw_user_answer, str) else None

        normalized_user_answer = (user_answer or "").strip().lower()
        normalized_accepted_answers = [
            answer.strip().lower() for answer in accepted_answers
        ]

        is_correct = normalized_user_answer in normalized_accepted_answers

        if is_correct:
            score += 1

        results.append(
            {
                "question_id": question_id,
                "user_answer": user_answer,
                "correct": is_correct,
                "correct_answers": accepted_answers,
                "explanation": {
                    "why_correct": metadata.get("why_correct", ""),
                    "why_others_wrong": metadata.get("why_others_wrong", {}),
                },
            }
        )

    attempt = SectionAttempt.objects.create(
        section=section,
        user=user,
        submitted_at=timezone.now(),
        time_spent_seconds=time_spent_seconds,
        answers_json=answers,
        score=score,
        max_score=max_score,
        results_json=results,
    )

    section.status = SECTION_STATUS_SUBMITTED
    section.save(update_fields=["status", "updated_at"])

    exam = section.exam
    all_sections_submitted = not exam.sections.exclude(status=SECTION_STATUS_SUBMITTED).exists()  # type: ignore
    exam.status = EXAM_STATUS_COMPLETED if all_sections_submitted else EXAM_STATUS_IN_PROGRESS
    exam.save(update_fields=["status", "updated_at"])

    return attempt
