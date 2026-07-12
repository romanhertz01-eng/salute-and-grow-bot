import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useMemo, useState, useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, ShieldCheck, RefreshCcw, Apple, Smartphone, Zap } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { cardsQueryOptions, type Card } from "@/lib/cards";
import { CardLogo } from "@/components/nhcard/CardLogo";
import { noWrapMoney } from "@/lib/format";

export const Route = createFileRoute("/podbor")({
  head: () => ({
    meta: [
      { title: "Подбор карты — EraPay" },
      {
        name: "description",
        content:
          "Пошаговый подбор зарубежной виртуальной карты для россиян: 6 вопросов и персональная рекомендация.",
      },
      { property: "og:title", content: "Подбор карты — EraPay" },
      {
        property: "og:description",
        content: "6 вопросов — и мы подберём карту под ваши задачи, бюджет и способ пополнения.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(cardsQueryOptions),
  component: PodborPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">
      Не удалось загрузить подборщик: {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Страница не найдена</div>
  ),
});

function PodborPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Suspense fallback={<div className="p-10 text-center text-sm text-muted-foreground">Загрузка…</div>}>
          <PodborWizard />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

type PurposeId = "subs" | "shops" | "ads" | "travel" | "crypto" | "all";
type TopupId = "sbp" | "crypto" | "any";
type KycId = "no" | "yes" | "any";
type BudgetId = "1000" | "5000" | "any";
type PayId = "yes" | "no";
type VolumeId = "low" | "mid" | "high";

type Answers = {
  purpose: PurposeId | null;
  topup: TopupId | null;
  kyc: KycId | null;
  budget: BudgetId | null;
  pay: PayId | null;
  volume: VolumeId | null;
};

const INITIAL: Answers = {
  purpose: null,
  topup: null,
  kyc: null,
  budget: null,
  pay: null,
  volume: null,
};

type Option = { id: string; title: string; hint?: string };
type Step = {
  key: keyof Answers;
  title: string;
  subtitle?: string;
  options: Option[];
};

const STEPS: Step[] = [
  {
    key: "purpose",
    title: "Что чаще всего оплачиваете?",
    subtitle: "Выберите основной сценарий — от него зависит подбор карты.",
    options: [
      { id: "subs", title: "Подписки и нейросети", hint: "ChatGPT, Netflix, Spotify" },
      { id: "shops", title: "Покупки в магазинах", hint: "Amazon, eBay, iHerb" },
      { id: "ads", title: "Реклама", hint: "Google Ads, TikTok Ads" },
      { id: "travel", title: "Путешествия", hint: "Booking, Airbnb, Uber" },
      { id: "crypto", title: "Криптовалюта", hint: "Пополнение и покупки в USDT" },
      { id: "all", title: "Всё понемногу", hint: "Универсальный сценарий" },
    ],
  },
  {
    key: "topup",
    title: "Как планируете пополнять?",
    options: [
      { id: "sbp", title: "СБП (рубли)", hint: "Из российского банка" },
      { id: "crypto", title: "Криптовалюта (USDT)", hint: "TRC-20 / ERC-20" },
      { id: "any", title: "Не важно" },
    ],
  },
  {
    key: "kyc",
    title: "Готовы проходить верификацию (KYC)?",
    options: [
      { id: "no", title: "Нет, хочу без KYC", hint: "Быстрый выпуск, без документов" },
      { id: "yes", title: "Да, готов", hint: "Больше надёжных вариантов" },
      { id: "any", title: "Не важно" },
    ],
  },
  {
    key: "budget",
    title: "Какой бюджет на выпуск карты?",
    options: [
      { id: "1000", title: "До 1 000 ₽" },
      { id: "5000", title: "До 5 000 ₽" },
      { id: "any", title: "Не важно, главное надёжность" },
    ],
  },
  {
    key: "pay",
    title: "Нужны ли Apple Pay / Google Pay?",
    options: [
      { id: "yes", title: "Да, обязательно" },
      { id: "no", title: "Не нужны" },
    ],
  },
  {
    key: "volume",
    title: "Какой примерный оборот в месяц?",
    options: [
      { id: "low", title: "До 10 000 ₽" },
      { id: "mid", title: "10 000 – 50 000 ₽" },
      { id: "high", title: "Больше 50 000 ₽" },
    ],
  },
];

function parsePrice(cost: string | null): number {
  if (!cost) return Number.POSITIVE_INFINITY;
  if (/бесплат|^0\s*₽|^0$/i.test(cost.trim())) return 0;
  const m = cost.match(/(\d[\d\s]*)/);
  return m ? Number(m[1].replace(/\s/g, "")) : Number.POSITIVE_INFINITY;
}

function hasSbp(c: Card): boolean {
  return (c.topup_methods ?? []).some((m) => /сбп|sbp/i.test(m));
}
function hasCryptoTopup(c: Card): boolean {
  return (c.topup_methods ?? []).some((m) => /крипт|usdt|trc|erc|btc/i.test(m));
}

type Scored = { card: Card; score: number };

function scoreCard(c: Card, a: Answers): number {
  let score = Number(c.editorial_score ?? 0);
  const top = (c.top_services ?? []).map((s) => s.toLowerCase()).join(" ");

  switch (a.purpose) {
    case "subs":
      if (/chatgpt|openai|netflix|spotify|youtube|apple|подписк|нейросет/i.test(top)) score += 2.5;
      break;
    case "shops":
      if (/amazon|ebay|iherb|aliexpress|магазин|shop/i.test(top)) score += 2.5;
      break;
    case "ads":
      if (/google ads|tiktok|meta|реклам|ads/i.test(top)) score += 3;
      break;
    case "travel":
      if (/booking|airbnb|uber|путеше|travel/i.test(top)) score += 2.5;
      break;
    case "crypto":
      if (hasCryptoTopup(c)) score += 3;
      if (/heleket|epn|e\.pn/i.test(c.slug)) score += 1.5;
      break;
    case "all":
      score += Math.min((c.supported_services_count ?? 0) / 20, 2);
      break;
  }

  if (a.topup === "sbp") {
    if (hasSbp(c)) score += 2.5;
    else score -= 1.5;
  } else if (a.topup === "crypto") {
    if (hasCryptoTopup(c)) score += 2.5;
    else score -= 1.5;
  }

  if (a.kyc === "no") {
    if (!c.kyc) score += 2;
    else score -= 1.5;
  } else if (a.kyc === "yes") {
    if (c.kyc) score += 1;
  }

  const price = parsePrice(c.issue_cost);
  if (a.budget === "1000") {
    if (price <= 1000) score += 2;
    else score -= 2;
  } else if (a.budget === "5000") {
    if (price <= 5000) score += 1.5;
    else score -= 1.5;
  } else if (a.budget === "any") {
    if (c.verified) score += 0.5;
  }

  if (a.pay === "yes") {
    if (c.apple_pay || c.google_pay) score += 1.5;
    else score -= 2;
  }

  const limitMatch = (c.monthly_limit ?? "").match(/(\d[\d\s]*)/);
  const limitNum = limitMatch ? Number(limitMatch[1].replace(/\s/g, "")) : null;
  if (a.volume === "high" && limitNum !== null) {
    if (limitNum >= 100000) score += 1.5;
    else if (limitNum < 50000) score -= 1;
  }
  if (a.volume === "mid" && limitNum !== null && limitNum < 10000) score -= 1;

  if (c.verified) score += 0.3;

  return score;
}

function rankCards(cards: Card[], a: Answers): Scored[] {
  return cards.map((card) => ({ card, score: scoreCard(card, a) })).sort((x, y) => y.score - x.score);
}

function PodborWizard() {
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
  const [answers, setAnswers] = useState<Answers>(INITIAL);
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const isResult = step >= total;

  const headingRef = useRef<HTMLHeadingElement | null>(null);
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const currentStep = STEPS[step];
  const currentValue = currentStep ? (answers[currentStep.key] as string | null) : null;
  const canNext = isResult || currentValue !== null;

  function selectOption(id: string) {
    if (!currentStep) return;
    setAnswers((prev) => ({ ...prev, [currentStep.key]: id as never }));
  }
  function next() {
    if (!canNext) return;
    setStep((s) => Math.min(s + 1, total));
  }
  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }
  function reset() {
    setAnswers(INITIAL);
    setStep(0);
  }

  const ranked = useMemo(() => (isResult ? rankCards(cards, answers) : []), [isResult, cards, answers]);
  const progress = isResult ? 100 : (step / total) * 100;

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> На главную
          </Link>
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <span>{isResult ? "Готово" : `Шаг ${step + 1} из ${total}`}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-background"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(progress)}
          >
            <div className="h-full bg-accent transition-all duration-300" style={{ width: `${Math.max(progress, 4)}%` }} />
          </div>
        </div>

        {isResult ? (
          <ResultView ranked={ranked} answers={answers} onReset={reset} />
        ) : (
          <StepView key={step} step={currentStep!} value={currentValue} onSelect={selectOption} headingRef={headingRef} />
        )}

        {!isResult && (
          <div className="mt-8 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={back}
              disabled={step === 0}
              className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border bg-background px-5 text-sm font-semibold text-primary transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Назад
            </button>
            <button
              type="button"
              onClick={next}
              disabled={!canNext}
              className="inline-flex h-11 items-center gap-1.5 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === total - 1 ? "Показать результат" : "Далее"} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function StepView({
  step,
  value,
  onSelect,
  headingRef,
}: {
  step: Step;
  value: string | null;
  onSelect: (id: string) => void;
  headingRef: React.RefObject<HTMLHeadingElement | null>;
}) {
  return (
    <div>
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="font-serif text-3xl font-bold leading-tight tracking-tight text-primary outline-none sm:text-4xl"
      >
        {step.title}
      </h1>
      {step.subtitle && <p className="mt-3 text-[15px] text-muted-foreground">{step.subtitle}</p>}

      <div className="mt-8 grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={step.title}>
        {step.options.map((opt) => {
          const active = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(opt.id)}
              className={`group relative rounded-lg border bg-background p-5 text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
                active ? "border-primary bg-primary/[0.03] shadow-sm" : "border-border hover:border-primary/40 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    active ? "border-accent bg-accent" : "border-border bg-background"
                  }`}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" />}
                </span>
                <div>
                  <div className="font-serif text-lg font-semibold text-primary">{opt.title}</div>
                  {opt.hint && <div className="mt-1 text-sm text-muted-foreground">{opt.hint}</div>}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultView({ ranked, answers, onReset }: { ranked: Scored[]; answers: Answers; onReset: () => void }) {
  const best = ranked[0]?.card;
  const alts = ranked.slice(1, 3).map((r) => r.card);
  const why = buildExplanation(answers);

  if (!best) {
    return (
      <div className="rounded-lg border border-border bg-background p-6 text-sm text-muted-foreground">
        По вашим критериям ничего не найдено.{" "}
        <button type="button" onClick={onReset} className="font-semibold text-primary underline">
          Пройти заново
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">Ваш вариант</div>
      <h1 className="font-serif text-3xl font-bold leading-tight tracking-tight text-primary sm:text-4xl">
        {best.name}
      </h1>
      <p className="mt-3 max-w-2xl text-[15px] text-muted-foreground">{why}</p>

      <BigCard card={best} />

      {alts.length > 0 && (
        <div className="mt-10">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Тоже подходят</div>
          <div className="grid gap-3 sm:grid-cols-2">
            {alts.map((c) => (
              <SmallCard key={c.id} card={c} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex h-11 items-center gap-1.5 rounded-md border border-border bg-background px-5 text-sm font-semibold text-primary transition-colors hover:border-primary/40"
        >
          <RefreshCcw className="h-4 w-4" /> Пройти заново
        </button>
        <Link
          to="/"
          hash="rating"
          className="inline-flex h-11 items-center rounded-md border border-border bg-background px-5 text-sm font-semibold text-primary transition-colors hover:border-primary/40"
        >
          Ко всему рейтингу
        </Link>
      </div>
    </div>
  );
}

function BigCard({ card }: { card: Card }) {
  return (
    <article className="mt-8 overflow-hidden rounded-xl border border-accent/40 bg-background p-6 shadow-sm sm:p-8">
      <div className="flex flex-wrap items-start gap-5">
        <CardLogo
          name={card.name}
          logoUrl={card.logo_url}
          logoDomain={card.logo_domain}
          size={56}
          plateClassName="rounded-lg border border-border bg-surface text-primary"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="font-serif text-2xl font-bold text-primary">{card.name}</h2>
            {card.verified && <ShieldCheck className="h-4 w-4 text-accent" aria-label="проверено" />}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {card.payment_system} · {card.issuer_country}
            {card.bank ? ` · ${card.bank}` : ""}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {card.apple_pay && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                <Apple className="h-3 w-3" /> Apple Pay
              </span>
            )}
            {card.google_pay && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                <Smartphone className="h-3 w-3" /> Google Pay
              </span>
            )}
            {!card.kyc && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">
                <Zap className="h-3 w-3" /> без KYC
              </span>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-3xl font-bold text-primary">{Number(card.editorial_score).toFixed(1)}</div>
          <div className="text-[11px] text-muted-foreground">{card.reviews_count} отзывов</div>
        </div>
      </div>

      <dl className="mt-6 grid gap-x-6 gap-y-3 border-t border-border pt-5 text-sm sm:grid-cols-3">
        <Metric label="Выпуск" value={card.issue_cost} nowrap />
        <Metric label="Обслуживание" value={card.service_cost} nowrap />
        <Metric label="Пополнение" value={card.topup_fee} nowrap />
        <Metric label="Лимит/мес" value={card.monthly_limit} nowrap />
        <Metric label="Скорость" value={card.issue_speed} nowrap />
        <Metric label="BIN" value={card.bin_country} mono />
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/cards/$slug"
          params={{ slug: card.slug }}
          className="inline-flex h-11 items-center rounded-md border border-border bg-background px-5 text-sm font-semibold text-primary transition-colors hover:border-primary/40"
        >
          Обзор
        </Link>
        <a
          href={card.affiliate_url ?? "#"}
          target="_blank"
          rel="nofollow sponsored noopener"
          className="inline-flex h-11 items-center rounded-md bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
        >
          Оформить
        </a>
      </div>
    </article>
  );
}

function SmallCard({ card }: { card: Card }) {
  return (
    <article className="rounded-lg border border-border bg-background p-5 shadow-sm transition-colors hover:border-primary/40">
      <div className="flex items-start gap-3">
        <CardLogo name={card.name} logoUrl={card.logo_url} logoDomain={card.logo_domain} size={40} />
        <div className="min-w-0 flex-1">
          <Link to="/cards/$slug" params={{ slug: card.slug }} className="font-semibold text-primary hover:underline">
            {card.name}
          </Link>
          <div className="text-xs text-muted-foreground">
            {card.payment_system} · {card.issuer_country}
          </div>
        </div>
        <div className="text-right">
          <div className="font-serif text-lg font-bold text-primary">{Number(card.editorial_score).toFixed(1)}</div>
        </div>
      </div>
      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
        <Metric small nowrap label="Выпуск" value={card.issue_cost} />
        <Metric small nowrap label="Пополнение" value={card.topup_fee} />
      </dl>
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
          className="inline-flex h-9 flex-1 items-center justify-center rounded-md border border-border bg-background px-3 text-xs font-semibold text-primary"
        >
          Оформить
        </a>
      </div>
    </article>
  );
}

function Metric({
  label,
  value,
  mono,
  small,
  nowrap,
}: {
  label: string;
  value: string | null;
  mono?: boolean;
  small?: boolean;
  nowrap?: boolean;
}) {
  const display = nowrap && value ? noWrapMoney(value) : value;
  return (
    <div className={small ? "flex items-baseline justify-between gap-2" : ""}>
      <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd
        className={`${small ? "text-right text-xs" : "mt-0.5 text-sm"} font-medium text-foreground ${
          mono ? "font-mono " : ""
        }${nowrap ? "whitespace-nowrap tabular-nums" : ""}`}
      >
        {display ?? "—"}
      </dd>
    </div>
  );
}

function buildExplanation(a: Answers): string {
  const parts: string[] = [];
  const p: Record<PurposeId, string> = {
    subs: "оплату подписок и нейросетей",
    shops: "покупки в зарубежных магазинах",
    ads: "оплату рекламы",
    travel: "бронирование путешествий",
    crypto: "работу с криптовалютой",
    all: "универсальный сценарий",
  };
  if (a.purpose) parts.push(`Вы выбрали ${p[a.purpose]}`);
  if (a.topup === "sbp") parts.push("пополнение через СБП");
  if (a.topup === "crypto") parts.push("пополнение в USDT");
  if (a.kyc === "no") parts.push("без верификации KYC");
  if (a.kyc === "yes") parts.push("готовность пройти KYC");
  if (a.pay === "yes") parts.push("нужны Apple Pay / Google Pay");
  if (a.budget === "1000") parts.push("бюджет на выпуск до 1 000 ₽");
  if (a.budget === "5000") parts.push("бюджет на выпуск до 5 000 ₽");
  if (a.volume === "high") parts.push("оборот больше 50 000 ₽ в месяц");

  if (parts.length === 0) return "Мы подобрали карты по общему рейтингу редакции.";
  return `${parts.join(", ")} — эти карты лучше всего закрывают такой сценарий.`;
}
