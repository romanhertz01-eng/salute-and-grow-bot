import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { RatingSection } from "@/components/nhcard/Rating";
import { supabase } from "@/integrations/supabase/client";
import { cardsQueryOptions } from "@/lib/cards";
import { PUBLIC_ROBOTS } from "@/lib/config";

const URL = "https://erapay.ru/travel-cards";
const TITLE = "Карта для путешествий за границей: рейтинг 2026";
const DESC =
  "Иностранная карта для путешествий в 2026 году: оплата Booking, Airbnb, Agoda, отелей и предавторизаций за границей. Рейтинг тревел-карт для россиян.";

type CountryRow = { slug: string; name_ru: string; flag_emoji: string; currency: string };

const travelCountriesQueryOptions = queryOptions({
  queryKey: ["country_pages", "travel-landing"],
  queryFn: async (): Promise<CountryRow[]> => {
    const { data, error } = await supabase
      .from("country_pages" as never)
      .select("slug,name_ru,flag_emoji,currency,priority")
      .eq("published", true)
      .order("priority", { ascending: false });
    if (error) throw error;
    return ((data as CountryRow[] | null) ?? []).slice(0, 8);
  },
});

const travelServices: { slug: string; label: string; note: string }[] = [
  { slug: "booking", label: "Booking.com", note: "Отели по всему миру" },
  { slug: "airbnb", label: "Airbnb", note: "Апартаменты и дома" },
  { slug: "agoda", label: "Agoda", note: "Азия и тропические направления" },
];

const faq: { q: string; a: string }[] = [
  {
    q: "Какая карта лучше для путешествий за границей в 2026 году?",
    a: "Тревел-карта должна выдерживать предавторизацию (hold) в отелях и прокате авто, работать в Apple Pay / Google Pay и иметь адекватный курс конвертации. В верхней части рейтинга — карты Visa и Mastercard иностранных эмитентов, которые соответствуют этим требованиям.",
  },
  {
    q: "Проходит ли оплата на Booking, Airbnb и Agoda?",
    a: "Да, карты из топа рейтинга проходят на Booking.com, Airbnb и Agoda как для мгновенной оплаты, так и для брони с предавторизацией. Отдельные страницы сервисов с инструкциями — по ссылкам ниже.",
  },
  {
    q: "Что делать с блокировкой средств (hold) в отеле?",
    a: "Отель блокирует сумму на страховой депозит; она возвращается автоматически в течение 5–30 дней после выезда. Держите на карте запас 20–30% сверх стоимости брони, иначе hold не пройдёт и отель откажет в заселении.",
  },
  {
    q: "Нужны ли наличные, если есть иностранная карта?",
    a: "Небольшой запас в местной валюте пригодится для такси, рынков и чаевых. Крупные траты — отели, аренда авто, рестораны — удобнее закрывать картой: и hold пройдёт, и курс окажется ближе к межбанку.",
  },
  {
    q: "Работает ли Apple Pay и Google Pay за границей?",
    a: "Apple Pay и Google Pay работают там, где принимает физическая карта эмитента. У большинства карт в рейтинге поддержка бесконтакта есть — соответствующий фильтр включён в рейтинге выше.",
  },
];

export const Route = createFileRoute("/travel-cards")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "карта для путешествий за границей, тревел карта, карта для booking, карта для отелей" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: PUBLIC_ROBOTS },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          description: DESC,
          url: URL,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
            { "@type": "ListItem", position: 2, name: "Карты для путешествий", item: URL },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(cardsQueryOptions),
      context.queryClient.ensureQueryData(travelCountriesQueryOptions),
    ]);
    return {};
  },
  component: TravelCardsPage,
});

function TravelCardsPage() {
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
  const { data: countries } = useSuspenseQuery(travelCountriesQueryOptions);
  const top = [...cards].sort((a, b) => a.rank - b.rank).slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-10 sm:px-6 lg:px-8">
            <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Главная</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">Карты для путешествий</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">Подборка · Тревел</div>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Лучшие иностранные карты для путешествий в 2026 году
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Тревел-карта — это не просто «Visa за рубеж». Она должна выдержать hold в отеле на две недели,
              пройти в прокате авто с депозитом 300 евро, работать в Apple Pay в метро Стамбула и оплатить бронь
              на Booking в момент, когда бронирование ещё не подтверждено. Ниже — карты EraPay, которыми
              пользователи закрывают эти сценарии в поездках 2026 года.
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Топ-5 карт для путешествий</h2>
              <Link to="/" hash="rating" className="shrink-0 text-sm font-semibold text-accent hover:underline">
                Весь рейтинг →
              </Link>
            </div>
          </div>
          <RatingSection cards={top} />
        </section>

        {countries.length > 0 && (
          <section className="border-b border-border bg-surface">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Карты по странам</h2>
              <p className="mt-1 text-sm text-muted-foreground">Популярные направления с подборками карт под местную валюту.</p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {countries.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/country/$slug"
                      params={{ slug: c.slug }}
                      className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                        <span aria-hidden className="text-lg leading-none">{c.flag_emoji}</span>
                        <span>{c.currency}</span>
                      </div>
                      <div className="mt-1 font-serif text-lg font-bold text-primary">{c.name_ru}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Карты для оплаты в {c.name_ru} →</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Сервисы для бронирования</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {travelServices.map((s) => (
                <Link
                  key={s.slug}
                  to="/service/$slug"
                  params={{ slug: s.slug }}
                  className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">Тревел</div>
                  <div className="mt-1 font-serif text-lg font-bold text-primary">{s.label}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{s.note}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Частые вопросы про тревел-карты</h2>
            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-background shadow-sm">
              {faq.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none text-base font-semibold text-primary marker:hidden">{f.q}</summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}