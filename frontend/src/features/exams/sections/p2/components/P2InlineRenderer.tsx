import type { P2Content } from "@/features/exams/types";
import { cn } from "@/lib/utils";

interface P2InlineRendererProps {
  content: P2Content;
  answers: Record<string, string>;
  onChange: (questionId: string, answer: string) => void;
}

export function P2InlineRenderer({
  content,
  answers,
  onChange,
}: P2InlineRendererProps) {
  const answeredQuestions = Object.values(answers).filter(
    (value) => value.trim() !== "",
  ).length;

  const totalQuestions = content.total_gaps;

  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">
        Reading and Use of English
      </p>
      <h1 className="mt-1 text-2xl font-semibold">{content.title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {content.instructions}
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-background p-5">
        <div className="text-[15px] leading-8 text-foreground">
          {content.segments.map((segment, index) => {
            if (segment.type === "text") {
              return (
                <span key={`text-${index}`} className="whitespace-pre-wrap">
                  {segment.text}
                </span>
              );
            }

            const value = answers[segment.question_id] ?? "";

            return (
              <span
                key={`gap-${segment.question_id}`}
                className="mx-1 inline-flex items-baseline align-middle"
              >
                <span className="mr-1 text-[11px] font-medium text-muted-foreground">
                  ({segment.number - 8})
                </span>

                <input
                  type="text"
                  value={value}
                  onChange={(event) =>
                    onChange(segment.question_id, event.target.value)
                  }
                  placeholder=""
                  aria-label={`Question ${segment.number - 8}`}
                  className={cn(
                    "h-9 w-[72px] rounded-lg border px-2 text-center text-sm shadow-none outline-none transition",
                    value.trim()
                      ? "border-primary/40 bg-accent text-foreground"
                      : "border-border bg-card text-foreground",
                  )}
                />
              </span>
            );
          })}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-3">
        <div>
          <p className="text-sm font-medium">
            Answered {answeredQuestions} / {totalQuestions}
          </p>
          <p className="text-xs text-muted-foreground">
            Type one word directly into each gap.
          </p>
        </div>

        <div className="text-xs text-muted-foreground">Inline gap fill</div>
      </div>
    </section>
  );
}
