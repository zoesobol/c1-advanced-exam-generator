interface P1PassageProps {
  title: string;
  instructions: string;
  passage: string;
}

export function P1Passage({ title, instructions, passage }: P1PassageProps) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">
        Reading and Use of English
      </p>
      <h1 className="mt-1 text-2xl font-semibold">{title}</h1>
      <p className="mt-3 text-sm text-muted-foreground">{instructions}</p>

      <div className="mt-6 rounded-2xl border border-border bg-background p-5">
        <p className="whitespace-pre-line text-sm leading-7">{passage}</p>
      </div>
    </section>
  );
}
