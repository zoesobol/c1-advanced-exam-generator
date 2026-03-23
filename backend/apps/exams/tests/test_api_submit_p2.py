from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.exams.models import Exam, ExamSection, SectionAttempt

User = get_user_model()


class SubmitP2SectionApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="zoe",
            email="zoe@example.com",
            password="testpass123",
        )
        self.client.force_authenticate(user=self.user)  # type: ignore

        self.exam = Exam.objects.create(
            user=self.user,
            selected_parts=["P2"],
            mode="quality",
            difficulty="c1_mid",
            timer_enabled=True,
            uk_spelling=True,
            status="ready",
        )
        self.section = ExamSection.objects.create(
            exam=self.exam,
            part_code="P2",
            section_type="ruoe",
            status="ready",
            content_json={
                "title": "Reading and Use of English Part 2",
                "instructions": "Use one word for each gap.",
                "segments": [
                    {"type": "text", "text": "Example "},
                    {"type": "gap", "question_id": "q1", "number": 9},
                ],
                "total_gaps": 8,
            },
            answer_key_json={
                "q1": {
                    "correct": "from",
                    "accepted": ["from"],
                    "why_correct": "The fixed expression is 'free from'.",
                    "why_others_wrong": {},
                },
                "q2": {
                    "correct": "in",
                    "accepted": ["in"],
                    "why_correct": "The correct phrase is 'lie in'.",
                    "why_others_wrong": {},
                },
                "q3": {
                    "correct": "by",
                    "accepted": ["by"],
                    "why_correct": "The correct structure is 'followed by'.",
                    "why_others_wrong": {},
                },
                "q4": {
                    "correct": "to",
                    "accepted": ["to"],
                    "why_correct": "The fixed phrase is 'connected to'.",
                    "why_others_wrong": {},
                },
                "q5": {
                    "correct": "into",
                    "accepted": ["into"],
                    "why_correct": "We say 'divided into'.",
                    "why_others_wrong": {},
                },
                "q6": {
                    "correct": "at",
                    "accepted": ["at"],
                    "why_correct": "The expression is 'not at all'.",
                    "why_others_wrong": {},
                },
                "q7": {
                    "correct": "when",
                    "accepted": ["when"],
                    "why_correct": "'Even when' introduces contrast.",
                    "why_others_wrong": {},
                },
                "q8": {
                    "correct": "than",
                    "accepted": ["than"],
                    "why_correct": "The structure is 'rather than'.",
                    "why_others_wrong": {},
                },
            },
        )

    def test_authenticated_user_can_submit_p2_section(self):
        payload = {
            "answers": {
                "q1": "from",
                "q2": "in",
                "q3": "by",
                "q4": "to",
                "q5": "into",
                "q6": "at",
                "q7": "when",
                "q8": "than",
            },
            "time_spent_seconds": 123,
        }

        response = self.client.post(
            f"/api/sections/{self.section.id}/submit",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["score"], 8)  # type: ignore
        self.assertEqual(response.data["max_score"], 8)  # type: ignore
        self.assertEqual(len(response.data["results"]), 8)  # type: ignore

        self.section.refresh_from_db()
        self.exam.refresh_from_db()

        self.assertEqual(self.section.status, "submitted")
        self.assertEqual(self.exam.status, "completed")
        self.assertEqual(SectionAttempt.objects.count(), 1)

        attempt = SectionAttempt.objects.first()
        self.assertEqual(attempt.score, 8)  # type: ignore
        self.assertEqual(attempt.max_score, 8)  # type: ignore
        self.assertEqual(attempt.time_spent_seconds, 123)  # type: ignore

    def test_p2_submission_is_case_and_whitespace_insensitive(self):
        payload = {
            "answers": {
                "q1": " From ",
                "q2": " IN",
                "q3": "by ",
                "q4": " to ",
                "q5": "Into",
                "q6": "AT",
                "q7": " When ",
                "q8": "THAN",
            },
            "time_spent_seconds": 77,
        }

        response = self.client.post(
            f"/api/sections/{self.section.id}/submit",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["score"], 8)  # type: ignore
        self.assertEqual(response.data["max_score"], 8)  # type: ignore

    def test_p2_submission_returns_incorrect_results(self):
        payload = {
            "answers": {
                "q1": "to",
                "q2": "on",
                "q3": "with",
                "q4": "with",
                "q5": "for",
                "q6": "of",
                "q7": "if",
                "q8": "instead",
            },
            "time_spent_seconds": 55,
        }

        response = self.client.post(
            f"/api/sections/{self.section.id}/submit",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["score"], 0)  # type: ignore
        self.assertEqual(response.data["max_score"], 8)  # type: ignore

        results = response.data["results"]  # type: ignore
        self.assertEqual(len(results), 8)
        self.assertFalse(results[0]["correct"])
        self.assertEqual(results[0]["correct_answers"], ["from"])
        self.assertEqual(
            results[0]["explanation"]["why_correct"],
            "The fixed expression is 'free from'.",
        )

    def test_user_cannot_submit_someone_elses_p2_section(self):
        other_user = User.objects.create_user(
            username="agus",
            email="agus@example.com",
            password="testpass123",
        )
        other_exam = Exam.objects.create(
            user=other_user,
            selected_parts=["P2"],
            mode="quality",
            difficulty="c1_mid",
            timer_enabled=True,
            uk_spelling=True,
            status="ready",
        )
        other_section = ExamSection.objects.create(
            exam=other_exam,
            part_code="P2",
            section_type="ruoe",
            status="ready",
            answer_key_json={
                "q1": {
                    "correct": "from",
                    "accepted": ["from"],
                    "why_correct": "The fixed expression is 'free from'.",
                    "why_others_wrong": {},
                }
            },
        )

        payload = {
            "answers": {"q1": "from"},
            "time_spent_seconds": 30,
        }

        response = self.client.post(
            f"/api/sections/{other_section.id}/submit",
            payload,
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
