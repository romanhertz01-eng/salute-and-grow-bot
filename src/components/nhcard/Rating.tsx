import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Apple, Smartphone, Zap, ArrowUpRight, ShieldCheck, Search, X, ChevronsUpDown } from "lucide-react";
import type { Card } from "@/lib/cards";
import { initials } from "@/lib/cards";
import { noWrapMoney } from "@/lib/format";
import {
  getCardServiceSlugs,
  getTableServiceSlugs,
  SERVICES,
  SERVICES_BY_SLUG,
  CATEGORY_LABEL,
  CATEGORY_ORDER,
} from "@/lib/services";
import { ServiceIcon, ServicePreview, ServicesModal } from "./ServicesModal";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const QUICK_SERVICE_SLUGS = ["openai", "netflix", "spotify", "steam", "googleads", "bookingdotcom"];

type SortKey = "rank" | "price" | "speed";

type ChipId = string;

type Chip = {
  id: ChipId;
  label: string;
  test: (c: Card) => boolean;
};

function buildChips(cards: Card[]): Chip[] {
  const chips: Chip[] = [];
  // Payment systems
  const paySystems = new Map<string, number>();
  for (const c of cards) {
    const ps = (c.payment_system ?? "").trim();
    if (!ps) continue;
    // split combined like "Visa/Mastercard"
    for (const part of ps.split(/[\/,]|\s+и\s+/i).map((s) => s.trim()).filter(Boolean)) {
      paySystems.set(part, (paySystems.get(part) ?? 0) + 1);
    }
  }
  for (const [ps] of Array.from(paySystems.entries()).sort((a, b) => b[1] - a[1])) {
    chips.push({
      id: `ps:${ps}`,
      label: ps,
      test: (c) => new RegExp(ps.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(c.payment_system ?? ""),
    });
  }
  // SBP
  if (cards.some((c) => (c.topup_methods ?? []).some((m) => /сбп/i.test(m)))) {
    chips.push({
      id: "sbp",
      label: "СБП-пополнение",
      test: (c) => (c.topup_methods ?? []).some((m) => /сбп/i.test(m)),
    });
  }
  // Apple Pay
  if (cards.some((c) => c.apple_pay)) {
    chips.push({ id: "applepay", label: "Apple Pay", test: (c) => c.apple_pay });
  }
  // Countries
  const countries = new Map<string, number>();
  for (const c of cards) {
    const cc = (c.issuer_country ?? "").trim();
    if (!cc) continue;
    countries.set(cc, (countries.get(cc) ?? 0) + 1);
  }
  for (const [country] of Array.from(countries.entries()).sort((a, b) => b[1] - a[1])) {
    chips.push({
      id: `country:${country}`,
      label: country,
      test: (c) => c.issuer_country === country,
    });
  }
  return chips;
}

export function RatingSection({ cards, withControls = false }: { cards: Card[]; withControls?: boolean }) {
  const [activeChip, setActiveChip] = useState<ChipId | null>(null);
  const [sort, setSort] = useState<SortKey>("rank");
  const [search, setSearch] = useState("");
  const [serviceSlug, setServiceSlug] = useState<string | null>(null);
  const [servicePickerOpen, setServicePickerOpen] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  const chips = useMemo(() => (withControls ? buildChips(cards) : []), [cards, withControls]);

  const cardServiceMap = useMemo(() => {
    const m = new Map<string, string[]>();
    for (const c of cards) m.set(c.slug, getCardServiceSlugs(c.slug, c.top_services ?? null));
    return m;
  }, [cards]);

  const selectedService = serviceSlug ? SERVICES_BY_SLUG[serviceSlug] ?? null : null;

  const servicesGrouped = useMemo(() => {
    const map = new Map<string, typeof SERVICES>();
    for (const s of SERVICES) {
      const arr = map.get(s.category) ?? [];
      arr.push(s);
      map.set(s.category, arr);
    }
    return CATEGORY_ORDER
      .map((cat) => ({ cat, items: map.get(cat) ?? [] }))
      .filter((g) => g.items.length > 0);
  }, []);

  useEffect(() => {
    if (!withControls) return;
    function onApply(e: Event) {
      const detail = (e as CustomEvent<{ chip?: ChipId }>).detail;
      if (!detail) return;
      if (detail.chip) setActiveChip(detail.chip);
      requestAnimationFrame(() => {
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
    window.addEventListener("erapay:apply-filter", onApply as EventListener);
    return () => window.removeEventListener("erapay:apply-filter", onApply as EventListener);
  }, [withControls]);

  const filtered = useMemo(() => {
    if (!withControls) return cards;
    const chip = chips.find((f) => f.id === activeChip);
    const q = search.trim().toLowerCase();
    const list = cards.filter((c) => {
      if (chip && !chip.test(c)) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      if (serviceSlug) {
        const list = cardServiceMap.get(c.slug) ?? [];
        if (!list.includes(serviceSlug)) return false;
      }
      return true;
    });
    const sorted = [...list].sort((a, b) => {
      if (sort === "price") {
        const av = a.issue_cost_rub ?? Number.POSITIVE_INFINITY;
        const bv = b.issue_cost_rub ?? Number.POSITIVE_INFINITY;
        if (av !== bv) return av - bv;
        return a.rank - b.rank;
      }
      if (sort === "speed") {
        const av = a.issue_speed_minutes ?? Number.POSITIVE_INFINITY;
        const bv = b.issue_speed_minutes ?? Number.POSITIVE_INFINITY;
        if (av !== bv) return av - bv;
        return a.rank - b.rank;
      }
      return a.rank - b.rank;
    });
    return sorted;
  }, [cards, chips, activeChip, sort, withControls, search, serviceSlug, cardServiceMap]);

  const excludedForService = useMemo(() => {
    if (!serviceSlug) return 0;
    let n = 0;
    for (const c of cards) if ((cardServiceMap.get(c.slug) ?? []).length === 0) n += 1;
    return n;
  }, [cards, cardServiceMap, serviceSlug]);

  const hasAnyFilter =
    activeChip !== null || serviceSlug !== null || search.trim().length > 0;

  const resetAll = () => {
    setActiveChip(null);
    setServiceSlug(null);
    setSearch("");
  };

  const activeChipObj = chips.find((c) => c.id === activeChip) ?? null;

  return (
    <section ref={sectionRef} id="rating" className="scroll-mt-20 border-b border-border bg-background">
      <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="mb-5 flex flex-col gap-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-accent">Рейтинг · 2026</div>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            15 зарубежных виртуальных карт — от лучших к нишевым
          </h2>
        </div>

        {withControls && (
          <>
            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Поиск по названию карты"
                  aria-label="Поиск по названию карты"
                  className="h-9 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary focus:outline-none"
                />
              </div>
              <Popover open={servicePickerOpen} onOpenChange={setServicePickerOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Что оплачивать"
                    className="inline-flex h-9 min-w-[220px] items-center justify-between gap-2 rounded-md border border-border bg-background px-3 text-sm text-foreground hover:border-primary/40"
                  >
                    {selectedService ? (
                      <span className="flex items-center gap-2 truncate">
                        <ServiceIcon service={selectedService} size={18} />
                        <span className="truncate">{selectedService.name}</span>
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Что оплачивать</span>
                    )}
                    <ChevronsUpDown className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-[320px] p-0">
                  <Command>
                    <CommandInput placeholder="Найти сервис…" />
                    <CommandList>
                      <CommandEmpty>Ничего не найдено</CommandEmpty>
                      {servicesGrouped.map(({ cat, items }) => (
                        <CommandGroup key={cat} heading={CATEGORY_LABEL[cat]}>
                          {items.map((s) => (
                            <CommandItem
                              key={s.slug}
                              value={`${s.name} ${s.slug}`}
                              onSelect={() => {
                                setServiceSlug(s.slug);
                                setServicePickerOpen(false);
                              }}
                              className="flex items-center gap-2"
                            >
                              <ServiceIcon service={s} size={18} />
                              <span className="truncate">{s.name}</span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {selectedService && (
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground">
                  <ServiceIcon service={selectedService} size={14} />
                  {selectedService.name}
                  <button
                    type="button"
                    onClick={() => setServiceSlug(null)}
                    aria-label="Убрать фильтр сервиса"
                    className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary-foreground/20"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              </div>
            )}
            <div className="mb-3 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
              <div className="flex min-w-max items-center gap-2">
                <span className="text-xs text-muted-foreground">Популярные:</span>
                {QUICK_SERVICE_SLUGS.map((slug) => {
                  const s = SERVICES_BY_SLUG[slug];
                  if (!s) return null;
                  const active = serviceSlug === slug;
                  return (
                    <button
                      key={slug}
                      type="button"
                      onClick={() => setServiceSlug(active ? null : slug)}
                      aria-pressed={active}
                      className={`inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 text-xs font-medium transition-colors ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground/75 hover:border-primary/40 hover:text-primary"
                      }`}
                    >
                      <ServiceIcon service={s} size={14} />
                      {s.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <div className="-mx-4 flex-1 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
                <div className="flex min-w-max items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveChip(null)}
                    aria-pressed={activeChip === null}
                    className={`inline-flex h-8 items-center rounded-md border px-3 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                      activeChip === null
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground/75 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    Все {cards.length}
                  </button>
                  {chips.map((f) => {
                    const active = activeChip === f.id;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setActiveChip(active ? null : f.id)}
                        aria-pressed={active}
                        className={`inline-flex h-8 items-center whitespace-nowrap rounded-md border px-3 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground/75 hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {f.label}
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
                  <option value="speed">по скорости выпуска</option>
                </select>
              </div>
            </div>
            {hasAnyFilter && (
              <div className="mb-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Показано {filtered.length} из {cards.length}
                </span>
                <button
                  type="button"
                  onClick={resetAll}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Сбросить всё
                </button>
              </div>
            )}
          </>
        )}

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface/40 p-8 text-center">
            <p className="mb-4 text-sm text-muted-foreground">Под эти условия карт нет</p>
            <button
              type="button"
              onClick={resetAll}
              className="inline-flex h-9 items-center rounded-md border border-border bg-background px-4 text-xs font-semibold text-primary hover:border-primary/40"
            >
              Сбросить фильтр
            </button>
          </div>
        ) : (
          <>
        {/* Desktop table */}
        <div className="hidden overflow-x-auto rounded-lg border border-border bg-background shadow-sm lg:block">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-surface text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="w-14 py-3 pl-4">№</th>
                <th className="py-3 pr-4">Сервис</th>
                <th className="min-w-[110px] px-2.5 py-3">Выпуск</th>
                <th className="px-2.5 py-3">Обслуж.</th>
                <th className="px-2.5 py-3">Пополнение</th>
                <th className="min-w-[120px] px-2.5 py-3">Лимит/мес</th>
                <th className="px-2.5 py-3">Скорость</th>
                <th className="hidden px-2.5 py-3 2xl:table-cell">Сервисы</th>
                <th className="px-2.5 py-3">Оценка</th>
                <th className="sticky right-0 bg-surface py-3 pl-3 pr-4 shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.06)]"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <TableRow key={c.id} card={c} first={i === 0 && sort === "rank" && activeChip === null} />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="grid gap-3 lg:hidden">
          {filtered.map((c, i) => (
            <MobileCard key={c.id} card={c} first={i === 0 && sort === "rank" && activeChip === null} />
          ))}
        </div>
        {serviceSlug && excludedForService > 0 && (
          <p className="mt-3 text-xs text-muted-foreground">
            {excludedForService} карт не участвуют в фильтре — их список сервисов уточняется.
          </p>
        )}
          </>
        )}
      </div>
    </section>
  );
}

function TableRow({ card, first }: { card: Card; first: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const serviceSlugs = useMemo(
    () => getCardServiceSlugs(card.slug, card.top_services ?? null),
    [card.slug, card.top_services],
  );
  const tableSlugs = useMemo(
    () => getTableServiceSlugs(card.slug, serviceSlugs, 3),
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
            {card.bin_country && (
              <div className="mt-0.5 font-mono text-[11px] text-muted-foreground/80">BIN {card.bin_country}</div>
            )}
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
      <td className="whitespace-nowrap px-2.5 py-4 align-top text-foreground tabular-nums">{noWrapMoney(card.issue_cost)}</td>
      <td className="whitespace-nowrap px-2.5 py-4 align-top text-foreground tabular-nums">{noWrapMoney(card.service_cost)}</td>
      <td className="whitespace-nowrap px-2.5 py-4 align-top text-foreground tabular-nums">{noWrapMoney(card.topup_fee)}</td>
      <td className="whitespace-nowrap px-2.5 py-4 align-top tabular-nums">
        {card.monthly_limit ? (
          <span className="text-foreground">{noWrapMoney(card.monthly_limit)}</span>
        ) : (
          <span className="text-muted-foreground/70">нет данных</span>
        )}
      </td>
      <td className="whitespace-nowrap px-2.5 py-4 align-top tabular-nums">
        {card.issue_speed ? (
          <span className="text-foreground">{noWrapMoney(card.issue_speed)}</span>
        ) : (
          <span className="text-muted-foreground/70">нет данных</span>
        )}
      </td>
      <td className="hidden px-2.5 py-4 align-top 2xl:table-cell">
        <ServicePreview
          slugs={tableSlugs}
          total={serviceSlugs.length}
          onOpen={() => setModalOpen(true)}
        />
      </td>
      <td className="px-2.5 py-4 align-top">
        <div className="font-serif text-lg font-bold text-primary">{Number(card.editorial_score).toFixed(1)}</div>
        <div className="text-[11px] text-muted-foreground">{card.reviews_count} отзывов</div>
      </td>
      <td className="sticky right-0 bg-background py-4 pl-3 pr-4 align-top shadow-[-8px_0_8px_-8px_rgba(0,0,0,0.06)] group-hover:bg-surface/60">
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
            Оформить
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </td>
      <ServicesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cardName={card.name}
        slugs={serviceSlugs}
        supportedCount={card.supported_services_count ?? null}
      />
    </tr>
  );
}

function MobileCard({ card, first }: { card: Card; first: boolean }) {
  const [modalOpen, setModalOpen] = useState(false);
  const serviceSlugs = useMemo(
    () => getCardServiceSlugs(card.slug, card.top_services ?? null),
    [card.slug, card.top_services],
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
        <Row label="Выпуск" value={noWrapMoney(card.issue_cost)} nowrap />
        <Row label="Обслуж." value={noWrapMoney(card.service_cost)} nowrap />
        <Row label="Пополнение" value={noWrapMoney(card.topup_fee)} nowrap />
        <Row label="Лимит" value={card.monthly_limit ? noWrapMoney(card.monthly_limit) : null} nowrap />
        <Row label="Скорость" value={card.issue_speed ? noWrapMoney(card.issue_speed) : null} nowrap />
        <Row label="BIN" value={card.bin_country} mono />
      </dl>
      {serviceSlugs.length > 0 && (
        <div className="mt-3 border-t border-border pt-3">
          <ServicePreview
            slugs={tableSlugs}
            total={serviceSlugs.length}
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
          className="inline-flex h-9 flex-1 items-center justify-center gap-1 rounded-md bg-accent px-3 text-xs font-semibold text-accent-foreground"
        >
          Оформить
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
      <ServicesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        cardName={card.name}
        slugs={serviceSlugs}
        supportedCount={card.supported_services_count ?? null}
      />
    </article>
  );
}

function Row({ label, value, mono, nowrap }: { label: string; value: string | null; mono?: boolean; nowrap?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted-foreground">{label}</dt>
      <dd
        className={`text-right font-medium ${mono ? "font-mono " : ""}${nowrap ? "whitespace-nowrap tabular-nums " : ""}${
          value ? "text-foreground" : "text-muted-foreground/70"
        }`}
      >
        {value ?? "нет данных"}
      </dd>
    </div>
  );
}
