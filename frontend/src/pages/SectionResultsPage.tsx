import { Link, useLocation, useParams } from "react-router-dom";

import { ErrorState } from "@/components/shared/ErrorState";
import type { SubmitSectionResponse } from "@/features/exams/types";
import { P1ResultsCard } from "@/features/p1/components/P1ResultsCard";

interface ResultsLocationState {
  response?: SubmitSectionResponse;
  sectionTitle?: string;
}

export function SectionResultsPage() {
  const { examId, partCode } = useParams<{
    examId: string;
    partCode: string;
  }>();
  const location = useLocation();
  const state = location.state as ResultsLocationState | null;

  if (!state?.response) {
    return (
      <ErrorState
        title="Results unavailable"
        message="This page expects submission data from the section flow. For now, please submit the section again from the exam page."
      />
    );
  }

  const { response, sectionTitle } = state;

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card p-6">
        <p className="text-sm text-muted-foreground">{partCode} results</p>
        <h1 className="mt-1 text-3xl font-semibold">
          {sectionTitle ?? "Section results"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          You scored {response.score} out of {response.max_score}.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to={`/exams/${examId}`}
            className="rounded-2xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition hover:bg-accent"
          >
            Back to exam
          </Link>
          <Link
            to={`/exams/${examId}/sections/${partCode}`}
            className="rounded-2xl bg-foreground px-4 py-2.5 text-sm font-medium text-background transition hover:opacity-90"
          >
            View section again
          </Link>
        </div>
      </section>

      <section className="grid gap-4">
        {response.results.map((result, index) => (
          <P1ResultsCard
            key={result.question_id}
            index={index}
            result={result}
          />
        ))}
      </section>
    </div>
  );
}
