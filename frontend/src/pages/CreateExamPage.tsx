import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ErrorState } from "@/components/shared/ErrorState";
import { useAuth } from "@/features/auth/AuthContext";
import { createExam } from "@/features/exams/api/createExam";
import { CreateExamForm } from "@/features/exams/components/CreateExamForm";
import type { CreateExamPayload } from "@/features/exams/types";

export function CreateExamPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (payload: CreateExamPayload) => {
    try {
      setIsSubmitting(true);
      setError(null);
      const exam = await createExam(payload, accessToken);
      navigate(`/exams/${exam.id}`);
    } catch {
      setError("We couldn't create the exam right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section className="space-y-4">
        <p className="text-sm text-muted-foreground">New exam</p>
        <h1 className="text-3xl font-semibold">
          Create your first P1 mock exam
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          This page already feels like the real app, but it stays focused on a
          single, solid vertical slice: create exam → generate P1 → answer →
          review results.
        </p>

        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">What this slice covers</h2>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p>• Exam creation with stored settings</p>
            <p>• Section shell creation in the backend</p>
            <p>• Hardcoded P1 generation</p>
            <p>• Submission, scoring, and explanations</p>
          </div>
        </div>
      </section>

      <div className="space-y-4">
        {error ? <ErrorState message={error} /> : null}
        <CreateExamForm isSubmitting={isSubmitting} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
