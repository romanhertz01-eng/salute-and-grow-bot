import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import type { Card } from "@/lib/cards";
import { DEMO_MODE } from "@/lib/config";

type TopupFilter = { id: "any" | "sbp" | "usdt"; label: string };

const TOPUP_FILTERS: TopupFilter[] = [
  { id: "any", label: "Не важно" },
  { id: "sbp", label: "СБП" },
  { id: "usdt", label: "USDT" },
];

function matchesTopup(card: Card, filter: TopupFilter["id"]): boolean {
  if (filter === "any") return true;
  const methods = card.topup_methods ?? [];
  if (filter === "sbp") return methods.some((m) => /сбп/i.test(m));
  return methods.some((m) => /usdt|крипт/i.test(m));
}

function formatRub(n: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(n)) + " ₽";
}

export function CalculatorSection({ cards }: { cards: Card[] }) {
  const [turnover, setTurnover] = useState(15000);
  const [topupId, setTopupId] = useState<TopupFilter["id"]>("any");

  const { recommendations, excludedCount } = useMemo(() => {
    const filtered = cards.filter((c) => matchesTopup(c, topupId));
    const priced = filtered.filter(
      (c) =>
        c.issue_cost_rub != null &&
        c.service_cost_rub_year != null &&
        c.topup_fee_percent != null,
    );
    const scored = priced
      .map((c) => {
        const issue = c.issue_cost_rub ?? 0;
        const svc = c.service_cost_rub_year ?? 0;
        const fee = c.topup_fee_percent ?? 0;
        const topup = turnover * 12 * (fee / 100);
        return { card: c, issue, svc, fee, topup, total: issue + svc + topup };
      })
      .sort((a, b) => a.total - b.total)
      .slice(0, 3);
    return {
      recommendations: scored,
      excludedCount: filtered.length - priced.length,
    };
  }, [cards, turnover, topupId]);

  const top = recommendations[0];

  return (
    <section id="calculator" className="scroll-mt-20 border-b border-border bg-background">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Калькулятор
        </div>
        <h2 className="max-w-3xl font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
          Сколько реально стоит карта за год
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base">
          Цена выпуска — не вся стоимость. Добавьте обслуживание и комиссию пополнения с учётом
          вашего оборота — и решение часто оказывается неочевидным.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Input panel */}
          <div className="rounded-xl border border-border bg-surface/40 p-6 sm:p-8">
            <div className="mb-8">
              <div className="flex items-baseline justify-between">
                <label className="text-sm font-semibold text-primary">Месячный оборот</label>
                <span className="font-serif text-2xl font-bold text-primary tabular-nums">
                  {formatRub(turnover)}
                </span>
              </div>
              <input
                type="range"
                min={1000}
                max={200000}
                step={1000}
                value={turnover}
                onChange={(e) => setTurnover(parseInt(e.target.value, 10))}
                className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-border accent-[color:var(--primary)]"
              />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>1 000 ₽</span>
                <span>200 000 ₽</span>
              </div>
            </div>

            <div>
              <div className="mb-3 text-sm font-semibold text-primary">Чем пополняете</div>
              <div className="flex flex-wrap gap-2">
                {TOPUP_FILTERS.map((s) => {
                  const active = s.id === topupId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTopupId(s.id)}
                      className={
                        "rounded-full border px-4 py-2 text-sm transition " +
                        (active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40")
                      }
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result card — TCO for the top pick */}
          <div className="rounded-xl bg-primary p-6 text-primary-foreground shadow-lg sm:p-8">
            {top ? (
              <>
                <div className="text-sm uppercase tracking-[0.14em] text-primary-foreground/70">
                  Лучший вариант · год
                </div>
                <div className="mt-2 font-serif text-2xl font-bold sm:text-3xl">
                  {top.card.name}
                </div>
                <div className="mt-3 font-serif text-5xl font-bold tracking-tight sm:text-6xl">
                  {formatRub(top.total)}
                </div>
                <div className="mt-2 text-sm text-primary-foreground/70">
                  При обороте {formatRub(turnover)}/мес
                </div>

                <dl className="mt-8 space-y-3 border-t border-primary-foreground/15 pt-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-primary-foreground/80">Выпуск</dt>
                    <dd className="tabular-nums">{formatRub(top.issue)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-primary-foreground/80">Обслуживание (12 мес)</dt>
                    <dd className="tabular-nums">{formatRub(top.svc)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-primary-foreground/80">
                      Комиссия пополнения ({top.fee}%)
                    </dt>
                    <dd className="tabular-nums">{formatRub(top.topup)}</dd>
                  </div>
                  <div className="mt-2 flex justify-between border-t border-primary-foreground/15 pt-3 font-semibold">
                    <dt>Итого за год</dt>
                    <dd className="font-serif text-lg tabular-nums">{formatRub(top.total)}</dd>
                  </div>
                </dl>
              </>
            ) : (
              <div className="text-sm text-primary-foreground/80">
                Под выбранный способ пополнения нет карт с точными тарифами.
              </div>
            )}
          </div>
        </div>

        {recommendations.length > 0 && (
          <div className="mt-8">
            <div className="mb-3 text-sm font-semibold text-primary">
              Рекомендации под ваш профиль
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {recommendations.map((r, i) => (
                <li
                  key={r.card.id}
                  className="rounded-xl border border-border bg-surface/40 p-4"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground">
                      #{i + 1}
                    </span>
                    <Link
                      to="/cards/$slug"
                      params={{ slug: r.card.slug }}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {r.card.name}
                    </Link>
                    {r.card.verified && (
                      <ShieldCheck className="h-4 w-4 text-accent" aria-label="Проверено" />
                    )}
                    {r.card.is_ad && (
                      <span className="rounded-full border border-border px-2 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        Реклама
                      </span>
                    )}
                  </div>
                  <div className="mt-2 font-serif text-xl font-bold text-primary tabular-nums">
                    {formatRub(r.total)}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">за год</div>
                </li>
              ))}
            </ul>
            {excludedCount > 0 && (
              <div className="mt-3 text-xs text-muted-foreground">
                {excludedCount} карт не в расчёте — нет точных тарифов.
              </div>
            )}
            {DEMO_MODE && (
              <div className="mt-2 text-xs text-muted-foreground">
                Расчёт по демонстрационным тарифам.
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}