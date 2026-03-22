import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SectionStatusBadge } from "@/components/shared/SectionStatusBadge";
import { useAuth } from "@/features/auth/AuthContext";
import { generateSection } from "@/features/exams/api/generateSection";
import { getExam } from "@/features/exams/api/getExam";
import { ExamHeader } from "@/features/exams/components/ExamHeader";
import { ExamSectionTabs } from "@/features/exams/components/ExamSectionTabs";
import type { Exam } from "@/features/exams/types";

export function ExamDetailPage() {
  const { examId } = useParams<{ examId: string }>();
  const { accessToken } = useAuth();

  const [exam, setExam] = useState<Exam | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExam = async () => {
    if (!examId) return;

    try {
      setError(null);
      const response = await getExam(examId, accessToken);
      setExam(response);
    } catch {
      setError("We couldn't load this exam.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadExam();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, accessToken]);

  const handleGenerate = async (partCode: string) => {
    if (!examId) return;

    try {
      setIsGenerating(true);
      await generateSection(examId, partCode, accessToken);
      await loadExam();
    } catch {
      setError("We couldn't generate this section.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner label="Loading exam..." />;
  }

  if (error || !exam) {
    return <ErrorState message={error ?? "Exam not found."} />;
  }

  return (
    <div className="space-y-6">
      <ExamHeader exam={exam} />

      <section className="space-y-3">
        <div>
          <h2 className="text-xl font-semibold">Sections</h2>
          <p className="text-sm text-muted-foreground">
            Use the navigator below to move between sections.
          </p>
        </div>

        <ExamSectionTabs examId={exam.id} sections={exam.sections} />
      </section>

      <section className="grid gap-4">
        {exam.sections.map((section) => (
          <div
            key={section.id}
            className="rounded-3xl border border-border bg-card p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  {section.section_type}
                </p>
                <h3 className="mt-1 text-lg font-semibold">
                  {section.part_code}
                </h3>
                <div className="mt-3">
                  <SectionStatusBadge status={section.status} />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {section.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => void handleGenerate(section.part_code)}
                    disabled={isGenerating}
                    className="rounded-2xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-60"
                  >
                    {isGenerating
                      ? "Generating..."
                      : `Generate ${section.part_code}`}
                  </button>
                )}

                {(section.status === "ready" ||
                  section.status === "submitted") && (
                  <Link
                    to={`/exams/${exam.id}/sections/${section.part_code}`}
                    className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
                  >
                    Open section
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
