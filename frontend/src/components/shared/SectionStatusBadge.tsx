import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  pending: "border-border bg-muted text-foreground",
  generating: "border-border bg-accent text-foreground",
  ready: "border-foreground/20 bg-foreground text-background",
  failed: "border-destructive/30 bg-destructive/10 text-destructive",
  submitted: "border-border bg-secondary text-foreground",
};

export function SectionStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-2.5 py-1 text-xs font-medium capitalize",
        statusStyles[status] ?? "border-border bg-muted text-foreground",
      )}
    >
      {status.replace("_", " ")}
    </span>
  );
}
