import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuth } from "@/features/auth/AuthContext";
import { getExam } from "@/features/exams/api/getExam";
import { getSection, submitSection } from "@/features/exams/api/submitSection";
import { ExamSectionTabs } from "@/features/exams/components/ExamSectionTabs";
import type {
  Exam,
  SectionPayload,
  SubmitSectionResponse,
} from "@/features/exams/types";
import { P1InlineRenderer } from "@/features/p1/components/P1InlineRenderer";

export function ExamSectionPage() {
  const { examId, partCode } = useParams<{
    examId: string;
    partCode: string;
  }>();
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const [exam, setExam] = useState<Exam | null>(null);
  const [section, setSection] = useState<SectionPayload | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [startedAt] = useState<number>(Date.now());
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!examId || !partCode) return;

      try {
        setError(null);
        const [examResponse, sectionResponse] = await Promise.all([
          getExam(examId, accessToken),
          getSection(examId, partCode, accessToken),
        ]);

        setExam(examResponse);
        setSection(sectionResponse);
      } catch {
        setError("We couldn't load this section.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [examId, partCode, accessToken]);

  const totalQuestions = section?.content.questions.length ?? 0;
  const answeredQuestions = useMemo(
    () => Object.keys(answers).length,
    [answers],
  );

  const handleSelect = (questionId: string, answer: string) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    if (!section || !examId || !partCode) return;

    try {
      setIsSubmitting(true);

      const response: SubmitSectionResponse = await submitSection(
        section.id,
        {
          answers,
          time_spent_seconds: Math.max(
            0,
            Math.round((Date.now() - startedAt) / 1000),
          ),
        },
        accessToken,
      );

      navigate(`/exams/${examId}/sections/${partCode}/results`, {
        state: {
          response,
          sectionTitle: section.content.title,
        },
      });
    } catch {
      setError("We couldn't submit this section.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading section..." />;
  }

  if (error || !section || !exam) {
    return <ErrorState message={error ?? "Section not found."} />;
  }

  if (section.status === "pending") {
    return (
      <ErrorState
        title="Section not generated yet"
        message="Go back to the exam page and generate this section first."
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Section navigator</p>
          <h1 className="text-2xl font-semibold">{section.part_code}</h1>
        </div>

        <ExamSectionTabs examId={exam.id} sections={exam.sections} />
      </section>

      <P1InlineRenderer
        content={section.content}
        answers={answers}
        onSelect={handleSelect}
      />

      <div className="sticky bottom-4 z-20 rounded-3xl border border-border bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium">
              Answered {answeredQuestions} / {totalQuestions}
            </p>
            <p className="text-xs text-muted-foreground">
              Submit when you’re ready to see scoring and explanations.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={isSubmitting || answeredQuestions === 0}
            className="inline-flex items-center justify-center rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit section"}
          </button>
        </div>
      </div>
    </div>
  );
}
