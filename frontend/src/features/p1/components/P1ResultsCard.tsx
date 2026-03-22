import type { SectionResult } from "@/features/exams/types";

interface P1ResultsCardProps {
  index: number;
  result: SectionResult;
}

export function P1ResultsCard({ index, result }: P1ResultsCardProps) {
  const correctAnswer = result.correct_answers[0];

  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Question {index + 1}</p>
          <h2 className="text-lg font-semibold">
            {result.correct ? "Correct" : "Needs review"}
          </h2>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            result.correct
              ? "border border-border bg-secondary text-foreground"
              : "border border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {result.correct ? "Correct" : "Incorrect"}
        </span>
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        <p>
          <span className="font-medium">Your answer:</span>{" "}
          {result.user_answer ?? "No answer"}
        </p>
        <p>
          <span className="font-medium">Correct answer:</span> {correctAnswer}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-background p-4">
        <p className="text-sm font-medium">Why the correct answer works</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {result.explanation.why_correct}
        </p>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-background p-4">
        <p className="text-sm font-medium">Why the other options do not fit</p>
        <div className="mt-3 space-y-2 text-sm text-muted-foreground">
          {Object.entries(result.explanation.why_others_wrong).map(
            ([key, value]) => (
              <p key={key}>
                <span className="font-medium text-foreground">{key}:</span>{" "}
                {value}
              </p>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
