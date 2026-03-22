import type { Exam } from "@/features/exams/types";
import { formatExamTitle } from "@/lib/exam";

interface ExamHeaderProps {
  exam: Exam;
}

export function ExamHeader({ exam }: ExamHeaderProps) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Exam session</p>
          <h1 className="mt-1 text-2xl font-semibold">
            {formatExamTitle(exam.created_at, exam.selected_parts)}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Built for the first P1 mock vertical slice.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-border bg-background px-3 py-1.5">
            {exam.mode}
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1.5">
            {exam.difficulty}
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1.5">
            {exam.timer_enabled ? "timed" : "untimed"}
          </span>
          <span className="rounded-full border border-border bg-background px-3 py-1.5">
            {exam.uk_spelling ? "UK spelling" : "mixed spelling"}
          </span>
        </div>
      </div>
    </div>
  );
}
