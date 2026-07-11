import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Apple, Smartphone, Zap, ArrowUpRight, ShieldCheck } from "lucide-react";
import type { Card } from "@/lib/cards";
import { initials } from "@/lib/cards";
import { getCardServiceSlugs, getTableServiceSlugs } from "@/lib/services";
import { ServicePreview, ServicesModal } from "./ServicesModal";

type SortKey = "rank" | "price" | "speed";

type Filter =
  | "all"
  | "visa"
  | "mastercard"
  | "sbp"
  | "applepay"
  | "nokyc"
  | "am"
  | "kz"
  | "tr";

const FILTERS: { id: Filter; label: (n: number) => string; test: (c: Card) => boolean }[] = [
  { id: "all", label: (n) => `Все ${n}`, test: () => true },
  { id: "visa", label: () => "Visa", test: (c) => /visa/i.test(c.payment_system ?? "") },
  { id: "mastercard", label: () => "Mastercard", test: (c) => /mastercard/i.test(c.payment_system ?? "") },
  { id: "sbp", label: () => "СБП-пополнение", test: (c) => (c.topup_methods ?? []).some((m) => /сбп/i.test(m)) },
  { id: "applepay", label: () => "Apple Pay", test: (c) => c.apple_pay },
  { id: "nokyc", label: () => "Без KYC", test: (c) => !c.kyc },
  { id: "am", label: () => "Армения", test: (c) => c.issuer_country === "Армения" },
  { id: "kz", label: () => "Казахстан", test: (c) => c.issuer_country === "Казахстан" },
  { id: "tr", label: () => "Турция", test: (c) => c.issuer_country === "Турция" },
];

function priceRank(cost: string | null): number {
  if (!cost) return Number.POSITIVE_INFINITY;
  const m = cost.match(/(\d[\d\s]*)/);
  return m ? Number(m[1].replace(/\s/g, "")) : Number.POSITIVE_INFINITY;
}
function speedRank(s: string | null): number {
  if (!s) return 999;
  if (/мгнов/i.test(s)) return 0;
  const m = s.match(/(\d+)/);
  if (!m) return 500;
  const n = Number(m[1]);
  if (/дн/i.test(s)) return 1440 * n;
  if (/час/i.test(s)) return 60 * n;
  return n;
}

export function RatingSection({ cards }: { cards: Card[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey>("rank");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const test = FILTERS.find((f) => f.id === filter)?.test ?? (() => true);
    const q = query.trim().toLowerCase();
    const list = cards.filter(
      (c) => test(c) && (q === "" || c.name.toLowerCase().includes(q) || (c.bank ?? "").toLowerCase().includes(q)),
    );
    const sorted = [...list].sort((a, b) => {
      if (sort === "price") return priceRank(a.issue_cost) - priceRank(b.issue_cost);
      if (sort === "speed") return speedRank(a.issue_speed) - speedRank(b.issue_speed);
      return a.rank - b.rank;
    });
    return sorted;
  }, [cards, filter, sort, query]);

  return (
    <section id="rating" className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-5 flex flex-col gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">Рейтинг · 2026</div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            15 зарубежных виртуальных карт — от лучших к нишевым
          </h2>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию или сервису — например, ChatGPT, Netflix, Steam"
            className="h-11 w-full rounded-md border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Filter bar */}
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="-mx-4 flex-1 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
            <div className="flex min-w-max items-center gap-2">
              {FILTERS.map((f) => {
                const active = filter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFilter(f.id)}
                    className={`inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium transition-colors ${
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground/75 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {f.label(cards.length)}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="text-xs text-muted-foreground">
              Сортировка:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-8 rounded-md border border-border bg-background px-2 text-xs font-medium text-foreground focus:border-primary focus:outline-none"
            >
              <option value="rank">по рейтингу</option>
              <option value="price">по цене выпуска</option>
              <option value="speed">по скорости</option>
            </select>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden overflow-hidden rounded-lg border border-border bg-background shadow-sm lg:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="w-14 py-3 pl-4">№</th>
                <th className="py-3 pr-4">Сервис</th>
                <th className="px-3 py-3">Выпуск</th>
                <th className="px-3 py-3">Обслуж.</th>
                <th className="px-3 py-3">Пополнение</th>
                <th className="px-3 py-3">Лимит/мес</th>
                <th className="px-3 py-3">Скорость</th>
                <th className="hidden px-3 py-3 xl:table-cell">Сервисы</th>
                <th className="px-3 py-3">BIN</th>
                <th className="px-3 py-3">Оценка</th>
                <th className="py-3 pr-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <TableRow key={c.id} card={c} first={i === 0 && sort === "rank" && filter === "all"} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid gap-3 lg:hidden">
          {filtered.map((c, i) => (
            <MobileCard key={c.id} card={c} first={i === 0 && sort === "rank" && filter === "all"} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TableRow({ card, first }: { card: Card; first: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const serviceSlugs = useMemo(
    () => getCardServiceSlugs(card.slug, card.supported_services_count ?? 0),
    [card.slug, card.supported_services_count],
  );
  const tableSlugs = useMemo(
    () => getTableServiceSlugs(card.slug, serviceSlugs, 4),
    [card.slug, serviceSlugs],
  );
  return (
    <tr className="group relative border-b border-border last:border-b-0 transition-colors hover:bg-surface/60">

      <td className="relative py-4 pl-4 align-top">
        {first && <span className="absolute left-0 top-0 h-full w-1 bg-accent" aria-hidden />}
        <div
          className={`inline-flex h-8 w-8 items-center justify-center rounded-md font-serif text-sm font-bold ${
            first ? "bg-primary text-primary-foreground" : "bg-surface text-primary"
          }`}
        >
          {card.rank}
        </div>
      </td>
      <td className="py-4 pr-4 align-top">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-serif text-sm font-bold text-primary">
            {initials(card.name)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Link
                to="/cards/$slug"
                params={{ slug: card.slug }}
                className="font-semibold text-primary hover:underline"
              >
                {card.name}
              </Link>
              {card.verified && (
                <ShieldCheck className="h-3.5 w-3.5 text-accent" aria-label="проверено" />
              )}
            </div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              {card.payment_system} · {card.issuer_country}
            </div>
            <div className="mt-1.5 flex gap-1.5">
              {card.apple_pay && <Apple className="h-3.5 w-3.5 text-muted-foreground" aria-label="Apple Pay" />}
              {card.google_pay && (
                <Smartphone className="h-3.5 w-3.5 text-muted-foreground" aria-label="Google Pay" />
              )}
              {!card.kyc && <Zap className="h-3.5 w-3.5 text-muted-foreground" aria-label="без KYC" />}
            </div>
          </div>
        </div>
      </td>
      <td className="px-3 py-4 align-top text-foreground">{card.issue_cost}</td>
      <td className="px-3 py-4 align-top text-foreground">{card.service_cost}</td>
      <td className="px-3 py-4 align-top text-foreground">{card.topup_fee}</td>
      <td className="px-3 py-4 align-top text-foreground">{card.monthly_limit}</td>
      <td className="px-3 py-4 align-top text-foreground">{card.issue_speed}</td>
      <td className="hidden px-3 py-4 align-top xl:table-cell">
        <ServicePreview
          slugs={tableSlugs}
          total={card.supported_services_count ?? serviceSlugs.length}
          onOpen={() => setModalOpen(true)}
        />
      </td>
      <td className="px-3 py-4 align-top text-xs font-mono text-muted-foreground">{card.bin_country}</td>
      <td className="px-3 py-4 align-top">
        <div className="font-serif text-lg font-bold text-primary">{Number(card.editorial_score).toFixed(1)}</div>
        <div className="text-[11px] text-muted-foreground">{card.reviews_count} отзывов</div>
      </td>
      <td className="py-4 pr-4 align-top">
        <div className="flex items-center justify-end gap-2">
          <Link
            to="/cards/$slug"
            params={{ slug: card.slug }}
            className="inline-flex h-9 items-center rounded-md border border-border bg-background px-3 text-xs font-semibold text-primary transition-colors hover:border-primary/40"
          >
            Обзор
          </Link>
          <a
            href={card.affiliate_url ?? "#"}
            target="_blank"
            rel="nofollow sponsored noopener"
            className={`inline-flex h-9 items-center gap-1 rounded-md px-3 text-xs font-semibold shadow-sm transition-colors ${
              first
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "border border-border bg-background text-primary hover:border-primary/40"
            }`}
          >
            {first ? "Оформить" : <ArrowUpRight className="h-4 w-4" />}
          </a>
        </div>
      </td>
      <ServicesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cardName={card.name}
        slugs={serviceSlugs}
      />
    </tr>
  );
}

function MobileCard({ card, first }: { card: Card; first: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const serviceSlugs = useMemo(
    () => getCardServiceSlugs(card.slug, card.supported_services_count ?? 0),
    [card.slug, card.supported_services_count],
  );
  const tableSlugs = useMemo(
    () => getTableServiceSlugs(card.slug, serviceSlugs, 4),
    [card.slug, serviceSlugs],
  );
  return (
    <article
      className={`relative overflow-hidden rounded-lg border bg-background p-4 shadow-sm ${
        first ? "border-accent/40" : "border-border"
      }`}
    >
      {first && <span className="absolute left-0 top-0 h-full w-1 bg-accent" aria-hidden />}
      <div className="flex items-start gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md font-serif text-sm font-bold ${
            first ? "bg-primary text-primary-foreground" : "bg-surface text-primary"
          }`}
        >
          {card.rank}
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-serif text-sm font-bold text-primary">
          {initials(card.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Link
              to="/cards/$slug"
              params={{ slug: card.slug }}
              className="truncate font-semibold text-primary hover:underline"
            >
              {card.name}
            </Link>
            {card.verified && <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-accent" />}
          </div>
          <div className="text-xs text-muted-foreground">
            {card.payment_system} · {card.issuer_country}
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-lg font-bold text-primary">
            {Number(card.editorial_score).toFixed(1)}
          </div>
          <div className="text-[10px] text-muted-foreground">{card.reviews_count}</div>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3 text-xs">
        <Row label="Выпуск" value={card.issue_cost} />
        <Row label="Обслуж." value={card.service_cost} />
        <Row label="Пополнение" value={card.topup_fee} />
        <Row label="Лимит" value={card.monthly_limit} />
        <Row label="Скорость" value={card.issue_speed} />
        <Row label="BIN" value={card.bin_country} mono />
      </dl>
      {serviceSlugs.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <ServicePreview
            slugs={tableSlugs}
            total={card.supported_services_count ?? serviceSlugs.length}
            onOpen={() => setModalOpen(true)}
          />
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Link
          to="/cards/$slug"
          params={{ slug: card.slug }}
          className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-semibold text-primary"
        >
          Обзор
        </Link>
        <a
          href={card.affiliate_url ?? "#"}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-flex h-9 flex-1 items-center justify-center rounded-md bg-accent px-3 text-xs font-semibold text-accent-foreground"
        >
          Оформить
        </a>
      </div>
      <ServicesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cardName={card.name}
        slugs={serviceSlugs}
      />
    </article>
  );
}

function Row({ label, value, mono }: { label: string; value: string | null; mono?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={`text-right font-medium text-foreground ${mono ? "font-mono" : ""}`}>{value ?? "—"}</dd>
    </div>
  );
}
