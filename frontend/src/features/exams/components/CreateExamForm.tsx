import { useState } from "react";

import type { CreateExamPayload, PartCode } from "@/features/exams/types";

interface CreateExamFormProps {
  isSubmitting: boolean;
  onSubmit: (payload: CreateExamPayload) => Promise<void>;
}

const AVAILABLE_PARTS: {
  code: PartCode;
  title: string;
  description: string;
}[] = [
  {
    code: "P1",
    title: "P1 — Multiple-choice cloze",
    description: "Eight gaps with four options per question.",
  },
  {
    code: "P2",
    title: "P2 — Open cloze",
    description: "Eight gaps completed with one word each.",
  },
];

export function CreateExamForm({
  isSubmitting,
  onSubmit,
}: CreateExamFormProps) {
  const [selectedParts, setSelectedParts] = useState<PartCode[]>(["P1"]);
  const [mode, setMode] = useState<"budget" | "quality">("quality");
  const [difficulty, setDifficulty] = useState<"c1_low" | "c1_mid" | "c1_high">(
    "c1_mid",
  );
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [ukSpelling, setUkSpelling] = useState(true);

  const togglePart = (part: PartCode) => {
    setSelectedParts((current) => {
      if (current.includes(part)) {
        if (current.length === 1) {
          return current;
        }
        return current.filter((item) => item !== part);
      }

      return [...current, part].sort((a, b) =>
        a.localeCompare(b),
      ) as PartCode[];
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      selected_parts: selectedParts,
      mode,
      difficulty,
      timer_enabled: timerEnabled,
      uk_spelling: ukSpelling,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl border border-border bg-card p-6"
    >
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Selected sections
        </p>

        <div className="mt-3 grid gap-3">
          {AVAILABLE_PARTS.map((part) => {
            const checked = selectedParts.includes(part.code);

            return (
              <label
                key={part.code}
                className="flex items-start justify-between gap-4 rounded-2xl border border-foreground/15 bg-background p-4"
              >
                <div>
                  <p className="font-semibold">{part.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {part.description}
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => togglePart(part.code)}
                  className="mt-1 h-4 w-4"
                />
              </label>
            );
          })}
        </div>

        <p className="mt-3 text-xs text-muted-foreground">
          Choose one or more parts to include in this exam.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium">Generation mode</span>
          <select
            value={mode}
            onChange={(event) =>
              setMode(event.target.value as "budget" | "quality")
            }
            className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm"
          >
            <option value="quality">Quality</option>
            <option value="budget">Budget</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium">Difficulty</span>
          <select
            value={difficulty}
            onChange={(event) =>
              setDifficulty(
                event.target.value as "c1_low" | "c1_mid" | "c1_high",
              )
            }
            className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm"
          >
            <option value="c1_low">C1 low</option>
            <option value="c1_mid">C1 mid</option>
            <option value="c1_high">C1 high</option>
          </select>
        </label>
      </div>

      <div className="grid gap-3">
        <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-3">
          <div>
            <p className="text-sm font-medium">Enable timers</p>
            <p className="text-xs text-muted-foreground">
              Keep the exam flow closer to real practice.
            </p>
          </div>
          <input
            type="checkbox"
            checked={timerEnabled}
            onChange={(event) => setTimerEnabled(event.target.checked)}
            className="h-4 w-4"
          />
        </label>

        <label className="flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-3">
          <div>
            <p className="text-sm font-medium">Use UK spelling</p>
            <p className="text-xs text-muted-foreground">
              Preferred for Cambridge-style material.
            </p>
          </div>
          <input
            type="checkbox"
            checked={ukSpelling}
            onChange={(event) => setUkSpelling(event.target.checked)}
            className="h-4 w-4"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || selectedParts.length === 0}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating exam..." : "Create exam"}
      </button>
    </form>
  );
}
