from django.urls import path

from .views import (
    ExamDetailView,
    ExamListCreateView,
    ExamSectionDetailView,
    ExamSectionGenerateView,
    SectionSubmitView,
)

urlpatterns = [
    path("exams/", ExamListCreateView.as_view(), name="exam-list-create"),
    path("exams/<uuid:exam_id>/", ExamDetailView.as_view(), name="exam-detail"),
    path(
        "exams/<uuid:exam_id>/sections/<str:part_code>/",
        ExamSectionDetailView.as_view(),
        name="exam-section-detail",
    ),
    path(
        "exams/<uuid:exam_id>/sections/<str:part_code>/generate",
        ExamSectionGenerateView.as_view(),
        name="exam-section-generate",
    ),
    path(
        "sections/<uuid:section_id>/submit",
        SectionSubmitView.as_view(),
        name="section-submit",
    ),
]
