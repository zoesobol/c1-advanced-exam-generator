from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from apps.exams.models import Exam

User = get_user_model()


class CreateExamApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="zoe",
            email="zoe@example.com",
            password="testpass123",
        )
        self.client.force_authenticate(user=self.user) # type: ignore

    def test_authenticated_user_can_create_exam(self):
        payload = {
            "selected_parts": ["P1"],
            "mode": "quality",
            "difficulty": "c1_mid",
            "timer_enabled": True,
            "uk_spelling": True,
        }

        response = self.client.post("/api/exams/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Exam.objects.count(), 1)

        exam = Exam.objects.first()
        self.assertEqual(exam.user, self.user) # type: ignore
        self.assertEqual(exam.selected_parts, ["P1"]) # type: ignore
        self.assertEqual(exam.sections.count(), 1) # type: ignore

        section = exam.sections.first() # type: ignore
        self.assertEqual(section.part_code, "P1")
        self.assertEqual(section.section_type, "ruoe")
        self.assertEqual(section.status, "pending")

    def test_selected_parts_are_sorted_and_deduplicated(self):
        payload = {
            "selected_parts": ["W1", "P1", "W1"],
            "mode": "quality",
            "difficulty": "c1_mid",
            "timer_enabled": True,
            "uk_spelling": True,
        }

        response = self.client.post("/api/exams/", payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["selected_parts"], ["P1", "W1"]) # type: ignore
