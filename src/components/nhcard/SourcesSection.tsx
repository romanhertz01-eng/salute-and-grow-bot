export type Source = { title: string; url?: string | null };

export function SourcesSection({ sources }: { sources: Source[] | null | undefined }) {
  const items = (sources ?? []).filter((s) => s && s.title && s.title.trim().length > 0);
  if (items.length === 0) return null;
  return (
    <section className="mt-12 rounded-xl border border-border bg-surface p-6">
      <h2 className="font-serif text-xl font-bold text-primary">
        Источники и нормативные документы
      </h2>
      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-foreground/85">
        {items.map((s, i) => (
          <li key={i}>
            {s.url ? (
              <a
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline underline-offset-2 hover:text-accent"
              >
                {s.title}
              </a>
            ) : (
              <span>{s.title}</span>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}