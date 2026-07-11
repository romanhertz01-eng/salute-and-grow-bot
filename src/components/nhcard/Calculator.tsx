import { useMemo, useState } from "react";
import type { Card } from "@/lib/cards";

type TopupScenario = { id: string; label: string; fee: number };
type CardType = { id: string; label: string; issue: number; service: number };

const TOPUP_SCENARIOS: TopupScenario[] = [
  { id: "sbp0", label: "СБП · 0%", fee: 0 },
  { id: "sbp2", label: "СБП · 2%", fee: 2 },
  { id: "sbp4", label: "СБП · 4%", fee: 4 },
  { id: "usdt", label: "USDT · 1.5%", fee: 1.5 },
];

const CARD_TYPES: CardType[] = [
  { id: "free", label: "Бесплатный выпуск", issue: 0, service: 0 },
  { id: "paid", label: "Платная (~990 ₽)", issue: 990, service: 0 },
  { id: "premium", label: "Премиум-пластик", issue: 14990, service: 2400 },
];

function parseNumber(value: string | null): number {
  if (!value) return 0;
  const cleaned = value.replace(/\s|\u00a0/g, "");
  const match = cleaned.match(/-?\d+(?:[.,]\d+)?/);
  if (!match) return 0;
  return parseFloat(match[0].replace(",", "."));
}

function formatRub(n: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(Math.round(n)) + " ₽";
}

export function CalculatorSection({ cards }: { cards: Card[] }) {
  const [turnover, setTurnover] = useState(15000);
  const [scenarioId, setScenarioId] = useState("sbp2");
  const [cardTypeId, setCardTypeId] = useState("paid");

  const scenario = TOPUP_SCENARIOS.find((s) => s.id === scenarioId)!;
  const cardType = CARD_TYPES.find((c) => c.id === cardTypeId)!;

  const yearlyIssue = cardType.issue;
  const yearlyService = cardType.service;
  const yearlyTopup = turnover * 12 * (scenario.fee / 100);
  const total = yearlyIssue + yearlyService + yearlyTopup;

  const recommendations = useMemo(() => {
    return cards
      .map((c) => {
        const issue = parseNumber(c.issue_cost);
        const svc = parseNumber(c.service_cost);
        const fee = parseNumber(c.topup_fee);
        const cost = issue + svc + turnover * 12 * (fee / 100);
        return { card: c, cost };
      })
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 2);
  }, [cards, turnover]);

  return (
    <section className="border-b border-border bg-background">
      <div className="mx-auto max-w-[1240px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-accent">
          Калькулятор · единственный в рунете
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

            <div className="mb-8">
              <div className="mb-3 text-sm font-semibold text-primary">Сценарий пополнения</div>
              <div className="flex flex-wrap gap-2">
                {TOPUP_SCENARIOS.map((s) => {
                  const active = s.id === scenarioId;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setScenarioId(s.id)}
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

            <div>
              <div className="mb-3 text-sm font-semibold text-primary">Тип карты</div>
              <div className="flex flex-wrap gap-2">
                {CARD_TYPES.map((c) => {
                  const active = c.id === cardTypeId;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCardTypeId(c.id)}
                      className={
                        "rounded-full border px-4 py-2 text-sm transition " +
                        (active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/40")
                      }
                    >
                      {c.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Result card */}
          <div className="rounded-xl bg-primary p-6 text-primary-foreground shadow-lg sm:p-8">
            <div className="text-sm uppercase tracking-[0.14em] text-primary-foreground/70">
              Реальная стоимость за год
            </div>
            <div className="mt-3 font-serif text-5xl font-bold tracking-tight sm:text-6xl">
              {formatRub(total)}
            </div>
            <div className="mt-2 text-sm text-primary-foreground/70">
              При обороте {formatRub(turnover)}/мес
            </div>

            <dl className="mt-8 space-y-3 border-t border-primary-foreground/15 pt-6 text-sm">
              <div className="flex justify-between">
                <dt className="text-primary-foreground/80">Выпуск</dt>
                <dd className="tabular-nums">{formatRub(yearlyIssue)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-primary-foreground/80">Обслуживание (12 мес)</dt>
                <dd className="tabular-nums">{formatRub(yearlyService)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-primary-foreground/80">
                  Комиссия пополнения ({scenario.fee}%)
                </dt>
                <dd className="tabular-nums">{formatRub(yearlyTopup)}</dd>
              </div>
              <div className="mt-2 flex justify-between border-t border-primary-foreground/15 pt-3 font-semibold">
                <dt>Итого за год</dt>
                <dd className="font-serif text-lg tabular-nums">{formatRub(total)}</dd>
              </div>
            </dl>

            {recommendations.length > 0 && (
              <div className="mt-6 rounded-lg bg-primary-foreground/10 p-4 text-sm">
                <div className="text-primary-foreground/70">Под ваши параметры подходят:</div>
                <div className="mt-1 font-semibold">
                  {recommendations.map((r) => r.card.name).join(", ")}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}