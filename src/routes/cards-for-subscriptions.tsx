import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { RatingSection } from "@/components/nhcard/Rating";
import { cardsQueryOptions } from "@/lib/cards";
import { PUBLIC_ROBOTS } from "@/lib/config";

const URL = "https://erapay.ru/cards-for-subscriptions";
const TITLE = "Виртуальная карта для подписок: рейтинг 2026";
const DESC =
  "Виртуальная карта для оплаты иностранных подписок в 2026 году: ChatGPT, Netflix, Spotify, YouTube Premium, Midjourney. Рейтинг карт с рублёвым пополнением.";

const services: { slug: string; label: string; note: string }[] = [
  { slug: "chatgpt", label: "ChatGPT Plus", note: "OpenAI, 20$/мес" },
  { slug: "claude", label: "Claude Pro", note: "Anthropic, 20$/мес" },
  { slug: "netflix", label: "Netflix", note: "Стриминг, семейные тарифы" },
  { slug: "spotify", label: "Spotify Premium", note: "Музыка и подкасты" },
  { slug: "youtube-premium", label: "YouTube Premium", note: "Без рекламы и в фоне" },
  { slug: "midjourney", label: "Midjourney", note: "Генерация изображений" },
];

const faq: { q: string; a: string }[] = [
  {
    q: "Какая виртуальная карта лучше подходит для оплаты подписок в 2026 году?",
    a: "Для подписок важна не максимальная скорость, а стабильность автосписаний и минимальная стоимость владения. Оптимальный вариант — карта с бесплатным или недорогим обслуживанием и рублёвым пополнением через СБП. Конкретные модели — в топе рейтинга выше.",
  },
  {
    q: "Проходит ли оплата ChatGPT и других AI-сервисов?",
    a: "Да, у карт из верхней части рейтинга проходят подписки OpenAI (ChatGPT Plus), Anthropic (Claude Pro), Midjourney, Perplexity и другие AI-сервисы. У части карт есть отдельные лимиты для AI-биллинга — они указаны в карточке карты.",
  },
  {
    q: "Как избежать блокировки автосписания?",
    a: "Держите на карте небольшой запас средств поверх суммы подписки, используйте одну и ту же карту постоянно (не создавайте новую под каждый сервис) и не смешивайте на ней рискованные категории (гемблинг, крипто-шлюзы).",
  },
  {
    q: "Можно ли оплатить подписку по семейному тарифу для друзей?",
    a: "Технически семейные тарифы Netflix, Spotify, YouTube Premium работают с одной карты. Юридически сервис вправе ограничить использование одним домохозяйством — это правило самого сервиса, а не карты.",
  },
  {
    q: "Нужен ли загранпаспорт для карты под подписки?",
    a: "Не обязательно. Для подписочных сценариев подходят карты, которые выпускаются по внутреннему паспорту РФ или вовсе без KYC — в рейтинге такие карты помечены отдельным фильтром.",
  },
];

export const Route = createFileRoute("/cards-for-subscriptions")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "виртуальная карта для подписок, карта для chatgpt, карта для netflix, оплата иностранных подписок" },
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
            { "@type": "ListItem", position: 2, name: "Карты для подписок", item: URL },
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
    await context.queryClient.ensureQueryData(cardsQueryOptions);
    return {};
  },
  component: CardsForSubscriptionsPage,
});

function CardsForSubscriptionsPage() {
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
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
              <span className="text-foreground">Карты для подписок</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">Подборка · Подписки</div>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Лучшие виртуальные карты для оплаты иностранных подписок в 2026 году
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Подписки на ChatGPT, Netflix, Spotify, YouTube Premium и Midjourney списываются автоматически
              каждый месяц — здесь важна не яркая реклама эмитента, а стабильность автосписания и минимальная
              стоимость владения. Мы отобрали карты, которые проходят на AI-сервисах и стриминге, поддерживают
              рублёвое пополнение через СБП и не блокируют рекуррентные платежи.
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Топ-5 карт под подписки
              </h2>
              <Link to="/" hash="rating" className="shrink-0 text-sm font-semibold text-accent hover:underline">
                Весь рейтинг →
              </Link>
            </div>
          </div>
          <RatingSection cards={top} />
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Популярные подписки и AI-сервисы</h2>
            <p className="mt-1 text-sm text-muted-foreground">Инструкции по оплате и статус работы карт.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <Link
                  key={s.slug}
                  to="/service/$slug"
                  params={{ slug: s.slug }}
                  className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">Подписка</div>
                  <div className="mt-1 font-serif text-lg font-bold text-primary">{s.label}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{s.note}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Частые вопросы про подписки</h2>
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