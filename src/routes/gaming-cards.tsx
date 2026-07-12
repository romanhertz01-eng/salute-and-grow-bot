import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { RatingSection } from "@/components/nhcard/Rating";
import { cardsQueryOptions } from "@/lib/cards";
import { PUBLIC_ROBOTS } from "@/lib/config";
import { publishedServicesQueryOptions } from "@/lib/service-links";

const URL_ = "https://erapay.ru/gaming-cards";
const TITLE = "Карты для оплаты игр: Steam, PlayStation, Xbox в 2026 году";
const DESC =
  "Виртуальные карты для пополнения Steam, PlayStation Store и Xbox: региональные кошельки, локальные цены, оплата DLC и подписок.";
const SERVICE_SLUGS = ["steam", "playstation", "xbox"] as const;

const faq: { q: string; a: string }[] = [
  {
    q: "Как связаны регион магазина и страна карты?",
    a: "Steam, PlayStation Store и Xbox привязывают регион аккаунта к стране карты. Оплата из другого региона либо не проходит, либо ведёт к смене региона аккаунта с потерей части покупок и подписок.",
  },
  {
    q: "Что выгоднее — пополнять кошелёк или платить картой напрямую?",
    a: "Кошелёк удобнее: одна транзакция на пополнение вместо десятка мелких списаний за каждую покупку. Плюс, комиссию за конвертацию карта возьмёт только один раз, при зачислении на кошелёк.",
  },
  {
    q: "Почему цены в игровых магазинах различаются по регионам?",
    a: "Издатели устанавливают локальные цены с учётом покупательной способности рынка. Регион аккаунта определяет, какие цены вы видите; произвольно менять его нельзя — правила магазина запрещают, и часть контента после смены становится недоступной.",
  },
  {
    q: "Проходит ли оплата DLC и подписок?",
    a: "Да, если карта соответствует региону аккаунта. DLC и подписки (Xbox Game Pass, PlayStation Plus) списываются с той же карты, что и основные покупки, и подчиняются тем же правилам региона.",
  },
  {
    q: "Что делать, если платёж отклонён?",
    a: "Убедитесь, что регион карты совпадает с регионом аккаунта магазина, на карте достаточно средств и не превышен дневной лимит. Если всё в порядке, попробуйте оплатить меньшую сумму — магазин мог отправить крупный платёж на проверку антифрода.",
  },
];

export const Route = createFileRoute("/gaming-cards")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "карта для steam, карта для playstation, карта для xbox, оплата игр" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL_ },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: PUBLIC_ROBOTS },
    ],
    links: [{ rel: "canonical", href: URL_ }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: TITLE, description: DESC, url: URL_ }) },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
            { "@type": "ListItem", position: 2, name: "Карты для игр", item: URL_ },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }),
      },
    ],
  }),
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(cardsQueryOptions),
      context.queryClient.ensureQueryData(publishedServicesQueryOptions(SERVICE_SLUGS)),
    ]);
    return {};
  },
  component: GamingCardsPage,
});

function GamingCardsPage() {
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
  const { data: services } = useSuspenseQuery(publishedServicesQueryOptions(SERVICE_SLUGS));
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
              <span className="text-foreground">Карты для игр</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">Подборка · Игры</div>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Карты для оплаты игр: Steam, PlayStation, Xbox в 2026 году
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Игровые магазины работают по регионам: цены в Steam, PS Store и Xbox зависят от страны аккаунта,
              а страна аккаунта — от страны карты. Ниже — иностранные виртуальные карты, которые проходят в
              крупных сторах и подходят для пополнения кошельков в локальной валюте.
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Топ-5 карт для игровых магазинов</h2>
              <Link to="/" hash="rating" className="shrink-0 text-sm font-semibold text-accent hover:underline">
                Весь рейтинг →
              </Link>
            </div>
          </div>
          <RatingSection cards={top} />
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Как выбрать карту под игровой магазин</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Регион магазина</div>
                <p className="mt-2 text-sm text-muted-foreground">Определитесь с регионом аккаунта до выбора карты: BIN карты должен соответствовать региону, иначе платёж отклонится.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Пополнение кошелька</div>
                <p className="mt-2 text-sm text-muted-foreground">Одна крупная транзакция на кошелёк удобнее серии мелких: меньше касаний антифрода и одна конвертация вместо нескольких.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Локальные цены</div>
                <p className="mt-2 text-sm text-muted-foreground">Держите карту в валюте региона — так итоговая цена совпадает с ценником в магазине без сюрпризов на конвертации.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Подписки и DLC</div>
                <p className="mt-2 text-sm text-muted-foreground">Xbox Game Pass и PlayStation Plus списываются рекуррентно — берите карту, где рекуррентные списания проходят стабильно.</p>
              </li>
            </ul>
          </div>
        </section>

        {services.length > 0 && (
          <section className="border-b border-border bg-background">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Игровые магазины</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to="/service/$slug"
                    params={{ slug: s.slug }}
                    className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">Игры</div>
                    <div className="mt-1 font-serif text-lg font-bold text-primary">{s.name}</div>
                    <div className="mt-2 text-xs text-muted-foreground">Карты для оплаты {s.name} →</div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Частые вопросы про карты для игр</h2>
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
