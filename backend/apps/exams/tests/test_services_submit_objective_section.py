from django.contrib.auth import get_user_model
from django.test import TestCase

from apps.exams.models import Exam, ExamSection
from apps.exams.services import submit_objective_section

User = get_user_model()


class SubmitObjectiveSectionServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="zoe",
            email="zoe@example.com",
            password="testpass123",
        )
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
            answer_key_json={
                "q1": {
                    "correct": "from",
                    "accepted": ["from"],
                    "why_correct": "The fixed expression is 'free from'.",
                    "why_others_wrong": {},
                }
            },
        )

    def test_submit_objective_section_normalizes_string_answers(self):
        attempt = submit_objective_section(
            section=self.section,
            user=self.user,
            answers={"q1": " From "},
            time_spent_seconds=10,
        )

        self.assertEqual(attempt.score, 1)
        self.assertEqual(attempt.max_score, 1)
        self.assertTrue(attempt.results_json[0]["correct"])
