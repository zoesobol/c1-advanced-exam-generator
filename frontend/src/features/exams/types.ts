export type PartCode = "P1" | "P2";

export interface ExamSectionSummary {
  id: string;
  part_code: PartCode;
  section_type: "ruoe" | "writing";
  status: "pending" | "generating" | "ready" | "failed" | "submitted";
  generator_version: string;
  created_at: string;
  updated_at: string;
}

export interface Exam {
  id: string;
  mode: "budget" | "quality";
  difficulty: "c1_low" | "c1_mid" | "c1_high";
  timer_enabled: boolean;
  ruoe_timer_minutes: number;
  writing_timer_minutes: number;
  uk_spelling: boolean;
  status: "draft" | "generating" | "ready" | "in_progress" | "completed";
  selected_parts: PartCode[];
  sections: ExamSectionSummary[];
  created_at: string;
  updated_at: string;
}

export interface CreateExamPayload {
  selected_parts: PartCode[];
  mode: "budget" | "quality";
  difficulty: "c1_low" | "c1_mid" | "c1_high";
  timer_enabled: boolean;
  uk_spelling: boolean;
}

export interface P1Option {
  key: string;
  text: string;
}

export interface P1Question {
  question_id: string;
  number: number;
  options: P1Option[];
}

export interface P1TextSegment {
  type: "text";
  text: string;
}

export interface P1GapSegment {
  type: "gap";
  question_id: string;
  number: number;
}

export type P1Segment = P1TextSegment | P1GapSegment;

export interface P1Content {
  title: string;
  instructions: string;
  segments: P1Segment[];
  questions: P1Question[];
}

export interface P2TextSegment {
  type: "text";
  text: string;
}

export interface P2GapSegment {
  type: "gap";
  question_id: string;
  number: number;
  placeholder?: string;
}

export type P2Segment = P2TextSegment | P2GapSegment;

export interface P2Content {
  title: string;
  instructions: string;
  segments: P2Segment[];
  total_gaps: number;
}

interface BaseSectionPayload {
  id: string;
  exam_id: string;
  part_code: PartCode;
  section_type: "ruoe" | "writing";
  status: "pending" | "generating" | "ready" | "failed" | "submitted";
  created_at: string;
  updated_at: string;
}

export interface P1SectionPayload extends BaseSectionPayload {
  part_code: "P1";
  content: P1Content;
}

export interface P2SectionPayload extends BaseSectionPayload {
  part_code: "P2";
  content: P2Content;
}

export type SectionPayload = P1SectionPayload | P2SectionPayload;

export interface SectionResult {
  question_id: string;
  user_answer: string | null;
  correct: boolean;
  correct_answers: string[];
  explanation: {
    why_correct: string;
    why_others_wrong: Record<string, string>;
  };
}

export interface SubmitSectionPayload {
  answers: Record<string, string>;
  time_spent_seconds: number;
}

export interface SubmitSectionResponse {
  section_id: string;
  score: number;
  max_score: number;
  results: SectionResult[];
  submitted_at: string;
}
