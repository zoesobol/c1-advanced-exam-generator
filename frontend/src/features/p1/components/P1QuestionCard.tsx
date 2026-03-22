import type { P1Question } from "@/features/exams/types";
import { cn } from "@/lib/utils";

interface P1QuestionCardProps {
  question: P1Question;
  selectedAnswer?: string;
  onSelect: (questionId: string, answer: string) => void;
}

export function P1QuestionCard({
  question,
  selectedAnswer,
  onSelect,
}: P1QuestionCardProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5">
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Question {question.number}
        </p>
        <h2 className="text-lg font-semibold">Choose the best option</h2>
      </div>

      <div className="grid gap-3">
        {question.options.map((option) => {
          const checked = selectedAnswer === option.key;

          return (
            <label
              key={option.key}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition",
                checked
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background hover:bg-accent",
              )}
            >
              <input
                type="radio"
                name={question.question_id}
                value={option.key}
                checked={checked}
                onChange={() => onSelect(question.question_id, option.key)}
                className="sr-only"
              />
              <span
                className={cn(
                  "inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold",
                  checked
                    ? "border-background/20 bg-background/10 text-background"
                    : "border-border bg-card text-foreground",
                )}
              >
                {option.key}
              </span>
              <span className="text-sm font-medium">{option.text}</span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
