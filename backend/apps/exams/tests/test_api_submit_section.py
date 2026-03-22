from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.exams.mock_generators import generate_mock_p1
from apps.exams.models import Exam, ExamSection, SectionAttempt

User = get_user_model()


class SubmitSectionApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="zoe",
            email="zoe@example.com",
            password="testpass123",
        )
        self.client.force_authenticate(user=self.user) # type: ignore

        generated = generate_mock_p1()

        self.exam = Exam.objects.create(
            user=self.user,
            selected_parts=["P1"],
            status="ready",
        )
        self.section = ExamSection.objects.create(
            exam=self.exam,
            part_code="P1",
            section_type="ruoe",
            status="ready",
            generator_version=generated["generator_version"],
            content_json=generated["content"],
            answer_key_json=generated["answer_key"],
            raw_model_output=generated["raw_model_output"],
            prompt_log_json=generated["prompt_log"],
        )

    def test_submit_section_returns_score_and_saves_attempt(self):
        payload = {
            "answers": {
                "q1": "A",
                "q2": "A",
                "q3": "A",
                "q4": "B",
                "q5": "A",
                "q6": "A",
                "q7": "C",
                "q8": "A",
            },
            "time_spent_seconds": 532,
        }

        url = f"/api/sections/{self.section.id}/submit"
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["score"], 8)  # type: ignore
        self.assertEqual(response.data["max_score"], 8)  # type: ignore
        self.assertEqual(len(response.data["results"]), 8)  # type: ignore

        self.section.refresh_from_db()
        self.exam.refresh_from_db()

        self.assertEqual(self.section.status, "submitted")
        self.assertEqual(self.exam.status, "completed")
        self.assertEqual(SectionAttempt.objects.count(), 1)

    def test_submit_section_includes_explanations(self):
        payload = {
            "answers": {
                "q1": "B",
                "q2": "B",
                "q3": "B",
                "q4": "A",
                "q5": "B",
                "q6": "B",
                "q7": "A",
                "q8": "B",
            },
            "time_spent_seconds": 100,
        }

        url = f"/api/sections/{self.section.id}/submit"
        response = self.client.post(url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        first_result = response.data["results"][0]  # type: ignore
        self.assertIn("explanation", first_result)
        self.assertIn("why_correct", first_result["explanation"])
        self.assertIn("why_others_wrong", first_result["explanation"])
