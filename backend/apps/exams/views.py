from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Exam, ExamSection
from .serializers import (
    ExamCreateSerializer,
    ExamDetailSerializer,
    ExamListSerializer,
    SectionPayloadSerializer,
    SectionSubmitSerializer,
)
from .services import (
    create_exam_for_user,
    generate_section_for_exam,
    submit_objective_section,
)


class ExamListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        exams = Exam.objects.filter(user=request.user).prefetch_related("sections")
        serializer = ExamListSerializer(exams, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ExamCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        exam = create_exam_for_user(
            user=request.user,
            selected_parts=serializer.validated_data["selected_parts"], # type: ignore
            mode=serializer.validated_data["mode"], # type: ignore
            difficulty=serializer.validated_data["difficulty"], # type: ignore
            timer_enabled=serializer.validated_data["timer_enabled"], # type: ignore
            uk_spelling=serializer.validated_data["uk_spelling"], # type: ignore
        )

        response_serializer = ExamDetailSerializer(exam)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)


class ExamDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id):
        exam = get_object_or_404(
            Exam.objects.prefetch_related("sections"),
            id=exam_id,
            user=request.user,
        )
        serializer = ExamDetailSerializer(exam)
        return Response(serializer.data)


class ExamSectionGenerateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, exam_id, part_code):
        exam = get_object_or_404(Exam, id=exam_id, user=request.user)
        section = generate_section_for_exam(exam=exam, part_code=part_code)
        serializer = SectionPayloadSerializer(section)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExamSectionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id, part_code):
        section = get_object_or_404(
            ExamSection,
            exam_id=exam_id,
            exam__user=request.user,
            part_code=part_code,
        )
        serializer = SectionPayloadSerializer(section)
        return Response(serializer.data)


class SectionSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, section_id):
        section = get_object_or_404(
            ExamSection,
            id=section_id,
            exam__user=request.user,
        )

        serializer = SectionSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        attempt = submit_objective_section(
            section=section,
            user=request.user,
            answers=serializer.validated_data["answers"], # type: ignore
            time_spent_seconds=serializer.validated_data["time_spent_seconds"], # type: ignore
        )

        return Response(
            {
                "section_id": str(section.id),
                "score": attempt.score,
                "max_score": attempt.max_score,
                "results": attempt.results_json,
                "submitted_at": attempt.submitted_at,
            },
            status=status.HTTP_200_OK,
        )
