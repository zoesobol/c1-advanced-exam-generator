from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.exams.models import Exam, ExamSection

User = get_user_model()


class GenerateP2SectionApiTests(APITestCase):
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
            status="draft",
        )
        self.section = ExamSection.objects.create(
            exam=self.exam,
            part_code="P2",
            section_type="ruoe",
            status="pending",
        )

    def test_authenticated_user_can_generate_p2_section(self):
        response = self.client.post(
            f"/api/exams/{self.exam.id}/sections/P2/generate",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.section.refresh_from_db()
        self.exam.refresh_from_db()

        self.assertEqual(self.section.status, "ready")
        self.assertEqual(self.exam.status, "ready")
        self.assertEqual(self.section.part_code, "P2")
        self.assertEqual(self.section.generator_version, "mock-p2-v1-segments")

        self.assertIn("title", self.section.content_json)
        self.assertIn("instructions", self.section.content_json)
        self.assertIn("segments", self.section.content_json)
        self.assertEqual(self.section.content_json["title"], "Reading and Use of English Part 2")
        self.assertEqual(self.section.content_json["total_gaps"], 8)

        gap_segments = [
            segment
            for segment in self.section.content_json["segments"]
            if segment["type"] == "gap"
        ]
        self.assertEqual(len(gap_segments), 8)

        self.assertIn("q1", self.section.answer_key_json)
        self.assertIn("q8", self.section.answer_key_json)
        self.assertEqual(self.section.answer_key_json["q1"]["correct"], "from")
        self.assertEqual(self.section.answer_key_json["q1"]["accepted"], ["from"])

    def test_user_cannot_generate_p2_for_someone_elses_exam(self):
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
            status="draft",
        )
        ExamSection.objects.create(
            exam=other_exam,
            part_code="P2",
            section_type="ruoe",
            status="pending",
        )

        response = self.client.post(
            f"/api/exams/{other_exam.id}/sections/P2/generate",
            {},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
