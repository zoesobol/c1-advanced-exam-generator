import { NavLink } from "react-router-dom";

import { SectionStatusBadge } from "@/components/shared/SectionStatusBadge";
import type { ExamSectionSummary } from "@/features/exams/types";
import { cn } from "@/lib/utils";

interface ExamSectionTabsProps {
  examId: string;
  sections: ExamSectionSummary[];
}

export function ExamSectionTabs({ examId, sections }: ExamSectionTabsProps) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1">
      {sections.map((section) => (
        <NavLink
          key={section.id}
          to={`/exams/${examId}/sections/${section.part_code}`}
          className={({ isActive }) =>
            cn(
              "min-w-[200px] rounded-2xl border p-4 transition",
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-card hover:bg-accent",
            )
          }
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">{section.part_code}</p>
              <p className="text-xs opacity-80">{section.section_type}</p>
            </div>
            <SectionStatusBadge status={section.status} />
          </div>
        </NavLink>
      ))}
    </div>
  );
}
