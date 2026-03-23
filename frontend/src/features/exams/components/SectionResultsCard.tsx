import type { SectionResult } from "@/features/exams/types";
import { cn } from "@/lib/utils";

interface SectionResultsCardProps {
  index: number;
  result: SectionResult;
}

export function SectionResultsCard({ index, result }: SectionResultsCardProps) {
  const userAnswer = result.user_answer?.trim() || "No answer";

  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Question {index + 1}</p>
          <h2 className="mt-1 text-lg font-semibold">{result.question_id}</h2>
        </div>

        <span
          className={cn(
            "inline-flex rounded-full px-3 py-1 text-xs font-medium",
            result.correct
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {result.correct ? "Correct" : "Incorrect"}
        </span>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-background p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Your answer
          </dt>
          <dd className="mt-2 text-sm font-medium text-foreground">
            {userAnswer}
          </dd>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Accepted answer{result.correct_answers.length > 1 ? "s" : ""}
          </dt>
          <dd className="mt-2 text-sm font-medium text-foreground">
            {result.correct_answers.join(", ")}
          </dd>
        </div>
      </dl>

      <div className="mt-4 rounded-2xl border border-border bg-background p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Explanation
        </p>
        <p className="mt-2 text-sm leading-6 text-foreground">
          {result.explanation.why_correct || "No explanation available."}
        </p>
      </div>

      {!result.correct &&
      Object.keys(result.explanation.why_others_wrong).length > 0 ? (
        <div className="mt-4 rounded-2xl border border-border bg-background p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Why the other options were wrong
          </p>

          <div className="mt-3 grid gap-2">
            {Object.entries(result.explanation.why_others_wrong).map(
              ([option, explanation]) => (
                <div
                  key={option}
                  className="rounded-xl border border-border px-3 py-2"
                >
                  <p className="text-sm font-medium text-foreground">
                    {option}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {explanation}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      ) : null}
    </article>
  );
}
