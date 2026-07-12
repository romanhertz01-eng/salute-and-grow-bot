import { Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Card } from "@/lib/cards";

type CountryRow = {
  slug: string;
  name_ru: string;
  flag_emoji: string;
  currency: string;
  priority: number;
};

export const homeCountriesQueryOptions = queryOptions({
  queryKey: ["country_pages", "home"],
  queryFn: async (): Promise<CountryRow[]> => {
    const { data, error } = await supabase
      .from("country_pages" as never)
      .select("slug,name_ru,flag_emoji,currency,priority")
      .eq("published", true)
      .eq("priority", 1)
      .order("priority", { ascending: false });
    if (error) throw error;
    return (data as CountryRow[] | null) ?? [];
  },
});

function plural(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "карта";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "карты";
  return "карт";
}

export function CountriesSection({ cards }: { cards: Card[] }) {
  const { data: rows } = useSuspenseQuery(homeCountriesQueryOptions);
  const counts = new Map<string, number>();
  for (const card of cards) {
    if (!card.issuer_country) continue;
    counts.set(card.issuer_country, (counts.get(card.issuer_country) ?? 0) + 1);
  }
  const items = rows
    .map((r) => ({ ...r, count: counts.get(r.name_ru) ?? 0 }))
    .slice(0, 8);
  if (items.length === 0) return null;

  return (
    <section id="countries" className="scroll-mt-20 border-b border-border bg-surface/40">
      <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          По странам
        </div>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          Куда едете — чем платить
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Подборки карт для оплаты в поездке: локальная валюта, приём Visa и
          Mastercard, депозиты в отелях и Apple Pay в терминалах.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((c) => (
            <Link
              key={c.slug}
              to="/country/$slug"
              params={{ slug: c.slug }}
              className="group flex flex-col rounded-xl border border-border bg-background p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            >
              <span aria-hidden="true" className="text-3xl leading-none">
                {c.flag_emoji}
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-primary">
                {c.name_ru}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.count > 0 ? `${c.count} ${plural(c.count)} · ${c.currency}` : c.currency}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}