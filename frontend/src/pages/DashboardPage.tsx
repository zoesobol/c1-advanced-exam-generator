import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { SectionStatusBadge } from "@/components/shared/SectionStatusBadge";
import { useAuth } from "@/features/auth/AuthContext";
import { listExams } from "@/features/exams/api/listExams";
import type { Exam } from "@/features/exams/types";
import { formatExamTitle } from "@/lib/exam";

export function DashboardPage() {
  const { user, accessToken } = useAuth();
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setError(null);
        const response = await listExams(accessToken);
        setExams(response);
      } catch {
        setError("We couldn't load your exams right now.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [accessToken]);

  if (isLoading) {
    return <LoadingSpinner label="Loading your exam workspace..." />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">Welcome back</p>
        <h1 className="mt-1 text-3xl font-semibold">Hi, {user?.email}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          Your auth flow is working, P1 is already wired end-to-end, and the app
          is now structured to support multiple Reading and Use of English
          parts.
        </p>

        <div className="mt-6">
          <Link
            to="/exams/new"
            className="inline-flex items-center rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90"
          >
            Start a new exam
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Recent exams</h2>
          <p className="text-sm text-muted-foreground">
            Your latest practice sessions will appear here.
          </p>
        </div>

        {exams.length === 0 ? (
          <EmptyState
            title="No exams yet"
            description="Create your first exam with P1, P2, or both."
            action={
              <Link
                to="/exams/new"
                className="inline-flex items-center rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
              >
                Create first exam
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4">
            {exams.map((exam) => (
              <Link
                key={exam.id}
                to={`/exams/${exam.id}`}
                className="rounded-3xl border border-border bg-card p-5 transition hover:bg-accent"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {formatExamTitle(exam.created_at, exam.selected_parts)}
                    </p>
                    <h3 className="mt-1 text-lg font-semibold">
                      {exam.selected_parts.join(", ")}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {exam.mode} · {exam.difficulty} ·{" "}
                      {exam.timer_enabled ? "timed" : "untimed"}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {exam.sections.map((section) => (
                      <div key={section.id}>
                        <SectionStatusBadge status={section.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
