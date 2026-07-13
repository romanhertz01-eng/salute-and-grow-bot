import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { MobileRatingCta } from "@/components/nhcard/MobileRatingCta";
import { RatingSection } from "@/components/nhcard/Rating";
import { cardsQueryOptions } from "@/lib/cards";
import { PUBLIC_ROBOTS } from "@/lib/config";

const URL = "https://erapay.ru/foreign-virtual-cards";
const TITLE = "Зарубежная виртуальная карта: рейтинг для россиян в 2026";
const DESC =
  "Как выбрать зарубежную виртуальную карту в 2026 году: рейтинг проверенных карт, стоимость, пополнение из РФ, поддержка сервисов и оплата за границей.";

const scenarios: { to: "/service/$slug"; slug: string; label: string; note: string }[] = [
  { to: "/service/$slug", slug: "chatgpt", label: "ChatGPT Plus", note: "Подписка OpenAI, оплата в USD" },
  { to: "/service/$slug", slug: "netflix", label: "Netflix", note: "Стриминг с семейными тарифами" },
  { to: "/service/$slug", slug: "steam", label: "Steam", note: "Игры, DLC и внутриигровые покупки" },
];

const countryScenarios: { slug: string; label: string; flag: string; note: string }[] = [
  { slug: "turkey", label: "Турция", flag: "🇹🇷", note: "Отели, рестораны, курорты" },
  { slug: "thailand", label: "Таиланд", flag: "🇹🇭", note: "Тревел и повседневная оплата" },
  { slug: "uae", label: "ОАЭ", flag: "🇦🇪", note: "Дубай, шопинг и отели 5*" },
];

const faq: { q: string; a: string }[] = [
  {
    q: "Можно ли оформить зарубежную виртуальную карту из России в 2026 году?",
    a: "Да. Все карты в рейтинге открываются онлайн из России без выезда за границу. Часть эмитентов работает по паспорту РФ, часть — по загранпаспорту; конкретные требования указаны в карточке каждой карты.",
  },
  {
    q: "Нужен ли загранпаспорт для выпуска карты?",
    a: "Не всегда. Ряд эмитентов принимает внутренний паспорт РФ, другим достаточно загранпаспорта, а некоторые продукты выпускаются вовсе без KYC. Смотрите параметр KYC в таблице рейтинга.",
  },
  {
    q: "Как пополнить зарубежную виртуальную карту из России?",
    a: "Самые распространённые способы — СБП по номеру телефона, перевод по реквизитам российской карты, USDT (TRC-20 или ERC-20) и P2P. Курс и комиссия указаны в карточке карты — сравнивать удобнее через рейтинг.",
  },
  {
    q: "Легально ли пользоваться зарубежной виртуальной картой резиденту РФ?",
    a: "Владение и использование зарубежных карт для оплаты товаров и услуг не запрещено. Резидент РФ обязан уведомлять налоговую об открытии счёта в иностранной организации и подавать отчёты о движении средств по правилам ФНС.",
  },
  {
    q: "Как выбрать зарубежную виртуальную карту под свои задачи?",
    a: "Отталкивайтесь от сценария: для подписок хватит недорогой карты с рублёвым пополнением; для рекламных кабинетов важна стабильность и высокие лимиты; для путешествий — поддержка предавторизации и Apple Pay. Используйте фильтры и калькулятор в рейтинге.",
  },
];

export const Route = createFileRoute("/foreign-virtual-cards")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "зарубежная виртуальная карта, виртуальная карта для россиян, карта visa mastercard за рубеж" },
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
            { "@type": "ListItem", position: 2, name: "Зарубежные виртуальные карты", item: URL },
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
  component: ForeignVirtualCardsPage,
});

function ForeignVirtualCardsPage() {
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
              <span className="text-foreground">Зарубежные виртуальные карты</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              Подборка · Приоритет 1
            </div>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Лучшие зарубежные виртуальные карты для россиян в 2026 году
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Российские Visa и Mastercard перестали работать за пределами РФ ещё в 2022 году, а
              внутренние платёжные системы не принимают в интернет-магазинах, стриминговых сервисах,
              рекламных кабинетах и большинстве отелей. Зарубежная виртуальная карта — легальный
              инструмент для оплаты подписок, покупок и поездок. Ниже — рейтинг карт EraPay:
              сравнение по цене владения, стабильности и поддержке сервисов.
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Топ-5 зарубежных виртуальных карт
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
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Как выбрать карту</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  t: "Стоимость владения",
                  d: "Смотрите не только на выпуск, но и на месячную плату, комиссии за пополнение и внутренний курс. Итоговая цена за 12 месяцев часто отличается от цены на лендинге эмитента.",
                },
                {
                  t: "Способы пополнения",
                  d: "СБП удобен для быстрых мелких пополнений, USDT (TRC-20) — для крупных сумм с минимальной комиссией. Проверьте, что банк принимает вашу схему.",
                },
                {
                  t: "KYC и документы",
                  d: "Часть карт выпускается по паспорту РФ, часть требует загранпаспорт, некоторые продукты работают без KYC до лимита. От этого зависит скорость выпуска.",
                },
                {
                  t: "Поддержка сервисов",
                  d: "Если нужны рекламные кабинеты Google/Meta, крипто-биржи или конкретный стриминг — сверьтесь со списком поддерживаемых сервисов на карточке карты.",
                },
              ].map((b) => (
                <div key={b.t} className="rounded-lg border border-border bg-background p-5 shadow-sm">
                  <div className="font-serif text-lg font-bold text-primary">{b.t}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{b.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Популярные сценарии</h2>
            <p className="mt-1 text-sm text-muted-foreground">Как чаще всего используют зарубежную виртуальную карту.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {scenarios.map((s) => (
                <Link
                  key={s.slug}
                  to={s.to}
                  params={{ slug: s.slug }}
                  className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                >
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">Сервис</div>
                  <div className="mt-1 font-serif text-lg font-bold text-primary">{s.label}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{s.note}</div>
                </Link>
              ))}
              {countryScenarios.map((c) => (
                <Link
                  key={c.slug}
                  to="/country/$slug"
                  params={{ slug: c.slug }}
                  className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                    <span aria-hidden className="text-lg leading-none">{c.flag}</span>
                    <span>Страна</span>
                  </div>
                  <div className="mt-1 font-serif text-lg font-bold text-primary">{c.label}</div>
                  <div className="mt-2 text-xs text-muted-foreground">{c.note}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Частые вопросы</h2>
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
      <MobileRatingCta />
      <SiteFooter />
    </div>
  );
}