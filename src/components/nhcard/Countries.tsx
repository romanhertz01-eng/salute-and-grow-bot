import { Link } from "@tanstack/react-router";
import type { Card } from "@/lib/cards";

type CountryDef = {
  name: string;
  flag: string;
  currency: string;
};

const COUNTRIES: CountryDef[] = [
  { name: "Армения", flag: "🇦🇲", currency: "AMD, USD" },
  { name: "Казахстан", flag: "🇰🇿", currency: "KZT, USD" },
  { name: "Турция", flag: "🇹🇷", currency: "TRY, USD" },
  { name: "Киргизия", flag: "🇰🇬", currency: "KGS, USD" },
  { name: "Кипр", flag: "🇨🇾", currency: "EUR" },
  { name: "Гонконг", flag: "🇭🇰", currency: "HKD, USD" },
];

function plural(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "карта";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "карты";
  return "карт";
}

export function CountriesSection({ cards }: { cards: Card[] }) {
  const items = COUNTRIES.map((c) => ({
    ...c,
    count: cards.filter((card) => card.issuer_country === c.name).length,
  })).filter((c) => c.count > 0);

  if (items.length === 0) return null;

  return (
    <section id="countries" className="scroll-mt-20 border-b border-border bg-surface/40">
      <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          По странам
        </div>
        <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          Карты по странам выпуска
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          У каждой страны свои правила KYC, валюта и принимаемые платёжные системы.
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((c) => (
            <Link
              key={c.name}
              to="/"
              hash="rating"
              className="group flex flex-col rounded-xl border border-border bg-background p-5 transition hover:border-primary/30 hover:shadow-sm"
            >
              <span aria-hidden="true" className="text-3xl leading-none">
                {c.flag}
              </span>
              <h3 className="mt-4 font-serif text-lg font-semibold text-primary">
                {c.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.count} {plural(c.count)} · {c.currency}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}