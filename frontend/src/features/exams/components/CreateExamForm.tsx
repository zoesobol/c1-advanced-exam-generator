import { useState } from "react";

import type { CreateExamPayload } from "@/features/exams/types";

interface CreateExamFormProps {
  isSubmitting: boolean;
  onSubmit: (payload: CreateExamPayload) => Promise<void>;
}

export function CreateExamForm({
  isSubmitting,
  onSubmit,
}: CreateExamFormProps) {
  const [mode, setMode] = useState<"budget" | "quality">("quality");
  const [difficulty, setDifficulty] = useState<"c1_low" | "c1_mid" | "c1_high">(
    "c1_mid",
  );
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [ukSpelling, setUkSpelling] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await onSubmit({
      selected_parts: ["P1"],
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
          Selected section
        </p>
        <div className="mt-3 rounded-2xl border border-foreground/15 bg-background p-4">
          <p className="font-semibold">P1 — Multiple-choice cloze</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Starting with one polished mock vertical slice.
          </p>
        </div>
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
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-foreground px-4 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Creating exam..." : "Create exam"}
      </button>
    </form>
  );
}
