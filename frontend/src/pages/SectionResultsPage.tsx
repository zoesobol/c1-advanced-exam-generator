import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { useAuth } from "@/features/auth/AuthContext";
import { getSectionResults } from "@/features/exams/api/getSectionResults";
import { getSection } from "@/features/exams/api/submitSection";
import { SectionResultsCard } from "@/features/exams/components/SectionResultsCard";
import type { SubmitSectionResponse } from "@/features/exams/types";

interface ResultsLocationState {
  response?: SubmitSectionResponse;
  sectionTitle?: string;
  sectionId?: string;
}

export function SectionResultsPage() {
  const { examId, partCode } = useParams<{
    examId: string;
    partCode: string;
  }>();
  const location = useLocation();
  const { accessToken } = useAuth();
  const state = location.state as ResultsLocationState | null;

  const [response, setResponse] = useState<SubmitSectionResponse | null>(
    state?.response ?? null,
  );
  const [sectionTitle, setSectionTitle] = useState<string | null>(
    state?.sectionTitle ?? null,
  );
  const [isLoading, setIsLoading] = useState(!state?.response);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (state?.response) {
        return;
      }

      if (!examId || !partCode) {
        setError("Results unavailable.");
        setIsLoading(false);
        return;
      }

      try {
        setError(null);

        let sectionId = state?.sectionId ?? null;

        if (!sectionId) {
          const section = await getSection(examId, partCode, accessToken);
          sectionId = section.id;
          setSectionTitle(section.content.title);
        }

        const results = await getSectionResults(sectionId, accessToken);
        setResponse(results);
      } catch {
        setError("We couldn't load these results.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
  }, [state, examId, partCode, accessToken]);

  if (isLoading) {
    return <LoadingSpinner label="Loading results..." />;
  }

  if (error || !response) {
    return (
      <ErrorState
        title="Results unavailable"
        message={error ?? "We couldn't find results for this section yet."}
      />
    );
  }

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
          <SectionResultsCard
            key={result.question_id}
            index={index}
            result={result}
          />
        ))}
      </section>
    </div>
  );
}
