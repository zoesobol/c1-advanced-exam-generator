from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.exams.models import Exam, ExamSection

User = get_user_model()


class GenerateP1ApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="zoe",
            email="zoe@example.com",
            password="testpass123",
        )
        self.client.force_authenticate(user=self.user) # type: ignore

        self.exam = Exam.objects.create(
            user=self.user,
            selected_parts=["P1"],
        )
        self.section = ExamSection.objects.create(
            exam=self.exam,
            part_code="P1",
            section_type="ruoe",
            status="pending",
        )

    def test_generate_p1_populates_section_content_and_answer_key(self):
        url = f"/api/exams/{self.exam.id}/sections/P1/generate"
        response = self.client.post(url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.section.refresh_from_db()
        self.exam.refresh_from_db()

        self.assertEqual(self.section.status, "ready")
        self.assertEqual(self.section.generator_version, "mock-p1-v3-segments")
        self.assertIn("title", self.section.content_json)
        self.assertIn("segments", self.section.content_json)
        self.assertIn("questions", self.section.content_json)
        self.assertIn("q1", self.section.answer_key_json)
        self.assertEqual(self.exam.status, "ready")
