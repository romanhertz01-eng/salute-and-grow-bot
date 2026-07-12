import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ShieldCheck,
  Check,
  Zap,
  Apple,
  CreditCard,
  ShieldOff,
  Star,
  ChevronRight,
} from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { ReviewsSection } from "@/components/nhcard/Reviews";
import { ServicesModal, ServicePreview } from "@/components/nhcard/ServicesModal";
import { cardBySlugQueryOptions, cardsQueryOptions, formatDate, initials } from "@/lib/cards";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import { getCardServiceSlugs } from "@/lib/services";
import { noWrapMoney } from "@/lib/format";
import { PUBLIC_ROBOTS } from "@/lib/config";

type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];

export const Route = createFileRoute("/cards/$slug")({
  head: ({ loaderData }) => {
    const data = loaderData as { name?: string; slug?: string } | undefined;
    const name = data?.name ?? "Карта";
    const slug = data?.slug ?? "";
    const url = `https://erapay.ru/cards/${slug}`;
    return {
      meta: [
        { title: `${name} — обзор и тарифы · EraPay` },
        { name: "description", content: `Условия, лимиты и способы пополнения карты ${name}. Проверено редакцией EraPay.` },
        { property: "og:title", content: `${name} — обзор и тарифы · EraPay` },
        { property: "og:description", content: `Условия, лимиты и способы пополнения карты ${name}. Проверено редакцией EraPay.` },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "robots", content: PUBLIC_ROBOTS },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  loader: async ({ context, params }) => {
    const card = await context.queryClient.ensureQueryData(cardBySlugQueryOptions(params.slug));
    if (!card) throw notFound();
    await context.queryClient.ensureQueryData(cardsQueryOptions);
    return { name: card.name, slug: card.slug };
  },
  component: CardPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Карта не найдена</h1>
        <p className="mt-3 text-muted-foreground">Проверьте адрес или вернитесь к рейтингу.</p>
        <Link to="/" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">
          К рейтингу
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
});

function Chip({ icon: Icon, label }: { icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-primary">
      <Icon className="h-3.5 w-3.5 text-accent" />
      {label}
    </span>
  );
}

function Tile({ label, value, nowrap }: { label: string; value: string | null | undefined; nowrap?: boolean }) {
  const display = nowrap && value ? noWrapMoney(value) : value;
  return (
    <div className="rounded-lg border border-border bg-background p-4 shadow-sm">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`mt-1.5 font-serif text-lg font-bold text-primary${nowrap ? " whitespace-nowrap tabular-nums" : ""}`}>{display || "—"}</div>
    </div>
  );
}

function CardPage() {
  const { slug } = Route.useParams();
  const { data: card } = useSuspenseQuery(cardBySlugQueryOptions(slug));
  const { data: allCards = [] } = useSuspenseQuery(cardsQueryOptions);
  const [modalOpen, setModalOpen] = useState(false);

  const topupMethods = card?.topup_methods ?? [];
  const hasSbp = useMemo(
    () => topupMethods.some((m) => /сбп|sbp/i.test(m)),
    [topupMethods],
  );

  const related = useMemo(
    () => allCards.filter((c) => c.slug !== slug).slice(0, 4),
    [allCards, slug],
  );

  // Единый источник правды по сервисам карты: справочник SERVICES.
  // Число в заголовке, «+N» в таблице и содержимое модалки всегда совпадают.
  const serviceSlugs = useMemo(() => {
    if (!card) return [] as string[];
    // Source of truth: the per-card catalog slice. Falls back to the DB
    // number for cards not yet in CARD_SERVICE_COUNTS.
    return getCardServiceSlugs(card.slug, card.top_services ?? null);
  }, [card]);
  const servicesTotal = serviceSlugs.length;

  // Aggregate rating from published reviews (real data only)
  const { data: reviewAgg } = useSuspenseQuery({
    queryKey: ["reviews_agg", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("card_slug", slug)
        .eq("status", "published");
      if (error) throw error;
      const rows = (data ?? []) as Pick<ReviewRow, "rating">[];
      if (rows.length === 0) return { avg: 0, count: 0 };
      const sum = rows.reduce((s, r) => s + r.rating, 0);
      return { avg: sum / rows.length, count: rows.length };
    },
  });

  if (!card) return null;

  const chips: { icon: React.ComponentType<{ className?: string }>; label: string }[] = [];
  if (hasSbp) chips.push({ icon: Check, label: "Пополнение через СБП" });
  if (card.apple_pay) chips.push({ icon: Apple, label: "Apple Pay" });
  if (card.google_pay) chips.push({ icon: CreditCard, label: "Google Pay" });
  if (!card.kyc) chips.push({ icon: ShieldOff, label: "Без KYC" });
  if (card.issue_speed) chips.push({ icon: Zap, label: `Выпуск за ${card.issue_speed}` });
  if (card.verified) chips.push({ icon: ShieldCheck, label: "Проверено редакцией" });

  const steps = [
    {
      t: "Перейдите к эмитенту",
      d: `Откройте сайт ${card.bank ?? "эмитента"} по кнопке выше — это официальная страница карты.`,
    },
    {
      t: "Выберите тип карты",
      d: `Выберите тариф ${card.name} — платёжная система ${card.payment_system ?? ""}${card.card_currency?.length ? `, валюта ${card.card_currency.join("/")}` : ""}.`,
    },
    {
      t: card.kyc ? "Пройдите верификацию (KYC)" : "Регистрация без KYC",
      d: card.kyc
        ? "Загрузите паспорт и селфи по инструкции — верификация обычно занимает 15–60 минут."
        : "Достаточно телефона и email — верификация паспортом не требуется.",
    },
    {
      t: "Пополните и оплачивайте",
      d: hasSbp
        ? "Переведите рубли через СБП — карта конвертирует их в валюту баланса и готова к оплате."
        : "Пополните карту доступным способом и используйте её в форме оплаты сервиса.",
    },
  ];

  const url = `https://erapay.ru/cards/${card.slug}`;
  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    description: `Виртуальная карта ${card.name} — обзор, тарифы и способы пополнения.`,
    brand: card.bank ? { "@type": "Brand", name: card.bank } : undefined,
    url,
  };
  if (reviewAgg.count > 0) {
    productLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: reviewAgg.avg.toFixed(2),
      reviewCount: reviewAgg.count,
      bestRating: 5,
      worstRating: 1,
    };
  }
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
      { "@type": "ListItem", position: 2, name: "Рейтинг карт", item: "https://erapay.ru/#rating" },
      { "@type": "ListItem", position: 3, name: card.name, item: url },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <main>
        {/* HERO */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Главная</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <Link to="/" hash="rating" className="hover:text-primary">Рейтинг карт</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">{card.name}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="min-w-0">
                <div className="flex items-start gap-5">
                  <CardLogo
                    name={card.name}
                    logoUrl={card.logo_url}
                    logoDomain={card.logo_domain}
                    size={64}
                    plateClassName="rounded-lg border border-border bg-background text-primary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Место в рейтинге · #{card.rank}
                    </div>
                    <h1 className="mt-1 font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
                      {card.name}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                      {card.payment_system && <span>{card.payment_system}</span>}
                      {card.bank && (
                        <>
                          <span aria-hidden>·</span>
                          <span>{card.bank}</span>
                        </>
                      )}
                      {card.issuer_country && (
                        <>
                          <span aria-hidden>·</span>
                          <span>{card.issuer_country}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {chips.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {chips.map((c) => (
                      <Chip key={c.label} icon={c.icon} label={c.label} />
                    ))}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={card.affiliate_url ?? "#"}
                    target="_blank"
                    rel="nofollow sponsored noopener"
                    className="inline-flex h-11 items-center rounded-md bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
                  >
                    Оформить на сайте эмитента
                  </a>
                  <Link
                    to="/"
                    hash="rating"
                    className="inline-flex h-11 items-center rounded-md border border-border bg-background px-4 text-sm font-semibold text-primary hover:border-primary/40"
                  >
                    К рейтингу
                  </Link>
                  {card.last_checked ? (
                    <span className="inline-flex h-11 items-center rounded-md border border-transparent px-1 text-xs text-muted-foreground">
                      Проверено {formatDate(card.last_checked)}
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Score card */}
              <aside className="rounded-xl border border-border bg-background p-6 shadow-sm">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Редакционная оценка
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="font-serif text-5xl font-bold text-primary">
                    {Number(card.editorial_score).toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
                <div className="mt-4 border-t border-border pt-4">
                  {reviewAgg.count > 0 ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <Star
                            key={n}
                            className={
                              n <= Math.round(reviewAgg.avg)
                                ? "h-4 w-4 fill-accent text-accent"
                                : "h-4 w-4 text-border"
                            }
                            aria-hidden
                          />
                        ))}
                        <span className="ml-1 text-sm font-semibold text-primary">
                          {reviewAgg.avg.toFixed(1)}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        Средняя оценка · {reviewAgg.count} отзывов
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Пользовательских отзывов пока нет — станьте первым ниже.
                    </div>
                  )}
                </div>
                {card.verified && (
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    <ShieldCheck className="h-3.5 w-3.5" /> Проверено
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>

        {/* PARAMETERS — grouped tiles */}
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1040px] px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Тарифы и условия
            </h2>

            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Стоимость
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  <Tile label="Выпуск" value={card.issue_cost} nowrap />
                  <Tile label="Обслуживание" value={card.service_cost} nowrap />
                  <Tile label="Комиссия пополнения" value={card.topup_fee} nowrap />
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Условия
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Tile label="Лимит в месяц" value={card.monthly_limit} nowrap />
                  <Tile label="Скорость выпуска" value={card.issue_speed} nowrap />
                  <Tile label="KYC" value={card.kyc ? "требуется" : "не требуется"} />
                  <Tile
                    label="Способы пополнения"
                    value={(card.topup_methods ?? []).join(", ") || null}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Технически
                </h3>
                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Tile label="Платёжная система" value={card.payment_system} />
                  <Tile label="Страна выпуска" value={card.issuer_country} />
                  <Tile label="Банк-эмитент" value={card.bank} />
                  <Tile label="BIN страны" value={card.bin_country} />
                  <Tile
                    label="Валюты карты"
                    value={(card.card_currency ?? []).join(", ") || null}
                  />
                  <Tile label="Apple Pay" value={card.apple_pay ? "поддерживается" : "нет"} />
                  <Tile label="Google Pay" value={card.google_pay ? "поддерживается" : "нет"} />
                  <Tile
                    label="Сервисов поддерживается"
                    value={servicesTotal > 0 ? String(servicesTotal) : null}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW TO ISSUE */}
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Как оформить {card.name}
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.t} className="rounded-lg border border-border bg-background p-5 shadow-sm">
                  <div className="font-serif text-2xl font-bold text-accent">{i + 1}</div>
                  <div className="mt-2 font-semibold text-primary">{s.t}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* HOW TO TOP UP */}
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Как пополнить {card.name}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              {hasSbp
                ? `Пополнение через СБП — самый быстрый способ: перевод занимает 1–5 минут. Рубли автоматически конвертируются${card.card_currency?.length ? ` в валюту карты (${card.card_currency.join("/")})` : ""}, поэтому проверяйте актуальный курс и оставляйте небольшой запас на комиссию сервиса при оплате. Комиссия пополнения${card.topup_fee ? ` — ${card.topup_fee}` : ""}.`
                : `Пополните карту доступным способом (${(card.topup_methods ?? []).join(", ") || "смотрите на сайте эмитента"}). Средства конвертируются${card.card_currency?.length ? ` в валюту карты (${card.card_currency.join("/")})` : ""} — проверяйте курс и оставляйте небольшой запас на комиссию сервиса при оплате.`}
            </p>
          </div>
        </section>

        {/* SUPPORTED SERVICES */}
        {servicesTotal > 0 && (
          <section className="border-b border-border bg-surface">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                  Поддерживаемые сервисы
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  Все {servicesTotal} сервисов →
                </button>
              </div>
              <div className="mt-6">
                <ServicePreview
                  slugs={serviceSlugs}
                  total={servicesTotal}
                  onOpen={() => setModalOpen(true)}
                />
              </div>
            </div>
            <ServicesModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              cardName={card.name}
              slugs={serviceSlugs}
            />
          </section>
        )}

        {/* REVIEWS */}
        <div className="mx-auto flex max-w-[1040px] items-center justify-end px-4 pt-8 sm:px-6 lg:px-8">
          <Link
            to="/cards/$slug/reviews"
            params={{ slug: card.slug }}
            className="text-sm font-semibold text-accent hover:underline"
          >
            Все отзывы →
          </Link>
        </div>
        <ReviewsSection cardSlug={card.slug} cardName={card.name} />

        {/* RELATED CARDS */}
        {related.length > 0 && (
          <section className="border-t border-border bg-surface">
            <div className="mx-auto max-w-[1040px] px-4 py-14 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Похожие карты
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Другие варианты из нашего рейтинга — сравните тарифы.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/cards/$slug"
                      params={{ slug: r.slug }}
                      className="block h-full rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <CardLogo name={r.name} logoUrl={r.logo_url} logoDomain={r.logo_domain} size={40} />
                        <div className="font-serif text-lg font-bold text-primary">
                          {Number(r.editorial_score).toFixed(1)}
                        </div>
                      </div>
                      <div className="mt-3 font-serif text-lg font-bold text-primary">{r.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {r.payment_system}
                        {r.issuer_country ? ` · ${r.issuer_country}` : ""}
                      </div>
                      <div className="mt-3 text-xs font-semibold text-accent">Подробнее →</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="bg-background">
          <div className="mx-auto max-w-[1040px] px-4 py-8 sm:px-6 lg:px-8">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              <Link to="/" className="hover:text-primary">Вернуться к рейтингу</Link>
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              EraPay не является эмитентом карты. Условия могут меняться — проверяйте информацию на сайте эмитента.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}