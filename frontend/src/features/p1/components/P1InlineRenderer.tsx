import { Check } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { P1Content } from "@/features/exams/types";
import { cn } from "@/lib/utils";

interface P1InlineRendererProps {
  content: P1Content;
  answers: Record<string, string>;
  onSelect: (questionId: string, answer: string) => void;
}

export function P1InlineRenderer({
  content,
  answers,
  onSelect,
}: P1InlineRendererProps) {
  const questionMap = new Map(
    content.questions.map((question) => [question.question_id, question]),
  );

  const answeredQuestions = Object.keys(answers).length;
  const totalQuestions = content.questions.length;

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

            const question = questionMap.get(segment.question_id);
            const selectedValue = answers[segment.question_id];

            if (!question) {
              return (
                <span
                  key={`gap-${segment.question_id}`}
                  className="mx-1 inline-flex rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1 text-sm text-destructive"
                >
                  Missing question
                </span>
              );
            }

            return (
              <span
                key={`gap-${segment.question_id}`}
                className="mx-1 inline-flex align-middle"
              >
                <Select
                  value={selectedValue}
                  onValueChange={(value) =>
                    onSelect(segment.question_id, value)
                  }
                >
                  <SelectTrigger
                    className={cn(
                      "inline-flex h-11 min-w-[148px] rounded-xl border px-3 text-sm shadow-none",
                      "text-foreground",
                      selectedValue
                        ? "border-primary/40 bg-accent text-foreground"
                        : "border-border bg-card text-foreground",
                    )}
                    aria-label={`Question ${segment.number}`}
                  >
                    <SelectValue placeholder={`(${segment.number}) Select`} />
                  </SelectTrigger>

                  <SelectContent className="rounded-2xl">
                    {question.options.map((option) => (
                      <SelectItem
                        key={option.key}
                        value={option.key}
                        className="rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-border text-xs font-semibold text-foreground">
                            {option.key}
                          </span>
                          <span className="text-foreground">{option.text}</span>
                          {selectedValue === option.key ? (
                            <Check className="ml-auto h-4 w-4 text-foreground" />
                          ) : null}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
            Fill each gap directly in the passage.
          </p>
        </div>

        <div className="text-xs text-muted-foreground">Inline gap fill</div>
      </div>
    </section>
  );
}
