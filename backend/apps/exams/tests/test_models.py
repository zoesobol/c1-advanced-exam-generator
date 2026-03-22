from django.contrib.auth import get_user_model
from django.db import IntegrityError
from django.test import TestCase

from apps.exams.constants import SECTION_TYPE_RUOE, infer_section_type, sort_parts
from apps.exams.models import Exam, ExamSection

User = get_user_model()


class ExamModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="zoe",
            email="zoe@example.com",
            password="testpass123",
        )

    def test_exam_stores_selected_parts(self):
        exam = Exam.objects.create(
            user=self.user,
            selected_parts=["P1", "W1"],
        )

        self.assertEqual(exam.selected_parts, ["P1", "W1"])

    def test_sort_parts_returns_canonical_order_and_deduplicates(self):
        parts = ["W1", "P3", "P1", "P3"]
        sorted_parts = sort_parts(parts)

        self.assertEqual(sorted_parts, ["P1", "P3", "W1"])

    def test_infer_section_type_for_p1_is_ruoe(self):
        self.assertEqual(infer_section_type("P1"), SECTION_TYPE_RUOE)

    def test_exam_section_is_unique_per_exam_and_part_code(self):
        exam = Exam.objects.create(
            user=self.user,
            selected_parts=["P1"],
        )

        ExamSection.objects.create(
            exam=exam,
            part_code="P1",
            section_type="ruoe",
        )

        with self.assertRaises(IntegrityError):
            ExamSection.objects.create(
                exam=exam,
                part_code="P1",
                section_type="ruoe",
            )
