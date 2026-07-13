import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { MobileRatingCta } from "@/components/nhcard/MobileRatingCta";
import { RatingSection } from "@/components/nhcard/Rating";
import { cardsQueryOptions } from "@/lib/cards";
import { PUBLIC_ROBOTS } from "@/lib/config";
import { publishedServicesQueryOptions } from "@/lib/service-links";

const URL_ = "https://erapay.ru/ads-cards";
const TITLE = "Карты для оплаты рекламы: Google Ads и TikTok в 2026 году";
const DESC =
  "Иностранные карты для пополнения рекламных кабинетов Google Ads, TikTok Ads и Facebook Ads: высокие лимиты, стабильные автосписания.";
const SERVICE_SLUGS = ["google-ads", "tiktok-ads", "facebook-ads"] as const;
const META_SLUGS = new Set(["facebook-ads"]);

const faq: { q: string; a: string }[] = [
  {
    q: "Какие лимиты нужны на карте для рекламного кабинета?",
    a: "Рекламный кабинет списывает автоматически по достижении порога биллинга (обычно $25–$1000 в зависимости от площадки и стажа аккаунта). На карте должен быть запас минимум на 2–3 автосписания, иначе кампании ставятся на паузу.",
  },
  {
    q: "Почему рекламный кабинет уходит на проверку после привязки карты?",
    a: "Площадки автоматически отправляют кабинет на модерацию, если по BIN, IP-адресу или истории платежей есть сомнения. Проверка — стандартная процедура антифрода; на её результат влияет качество аккаунта и его прошлые платежи, а не сама карта.",
  },
  {
    q: "Что делать, если автосписание не проходит?",
    a: "Проверьте баланс карты, отсутствие блокировок со стороны эмитента и активность 3-D Secure. Если баланс есть, а платёж всё равно отклоняется — обратитесь в поддержку эмитента: часто причина в дневном лимите или срабатывании антифрода на крупную сумму.",
  },
  {
    q: "Можно ли использовать одну карту для нескольких кабинетов?",
    a: "Технически — можно, но площадки видят пересечение платёжных данных и могут связывать аккаунты между собой. Если один из кабинетов будет заблокирован, риск распространяется на все связанные — учитывайте это при планировании закупок.",
  },
  {
    q: "В какой валюте держать баланс карты для рекламы?",
    a: "Оптимально — в валюте биллинга кабинета (USD или EUR у большинства площадок). Так исключается ежемесячная конвертация и её курсовые потери на крупных суммах.",
  },
];

export const Route = createFileRoute("/ads-cards")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "карта для google ads, карта для tiktok ads, карта для рекламы, оплата рекламного кабинета" },
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
            { "@type": "ListItem", position: 2, name: "Карты для рекламы", item: URL_ },
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
  component: AdsCardsPage,
});

function AdsCardsPage() {
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
  const { data: services } = useSuspenseQuery(publishedServicesQueryOptions(SERVICE_SLUGS));
  const top = [...cards].sort((a, b) => a.rank - b.rank).slice(0, 5);
  const hasMeta = services.some((s) => META_SLUGS.has(s.slug));

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-10 sm:px-6 lg:px-8">
            <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Главная</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">Карты для рекламы</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">Подборка · Реклама</div>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Карты для оплаты рекламы: Google Ads и TikTok в 2026 году
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Пополнение рекламного кабинета — это не разовый платёж, а поток автосписаний по мере расхода бюджета.
              Карте нужен запас лимита, стабильная история и BIN, который площадка не отправляет на дополнительную
              проверку. Ниже — иностранные виртуальные карты, которые выдерживают такой режим.
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Топ-5 карт для рекламных кабинетов</h2>
              <Link to="/" hash="rating" className="shrink-0 text-sm font-semibold text-accent hover:underline">
                Весь рейтинг →
              </Link>
            </div>
          </div>
          <RatingSection cards={top} />
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Как выбрать карту под рекламный кабинет</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Лимит и запас</div>
                <p className="mt-2 text-sm text-muted-foreground">Держите на карте запас на 2–3 будущих автосписания. Пустая карта = остановка кампаний до пополнения.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Стабильность списаний</div>
                <p className="mt-2 text-sm text-muted-foreground">Приоритет — карты с историей без отказов и с активным 3-D Secure. Именно такие модели редакция выделяет в верхней части рейтинга.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Валюта биллинга</div>
                <p className="mt-2 text-sm text-muted-foreground">Совпадение валюты карты и биллинга кабинета убирает ежемесячные потери на конвертации.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Регион BIN</div>
                <p className="mt-2 text-sm text-muted-foreground">Площадки чувствительны к BIN. Карты в рейтинге — из «нейтральных» регионов, к которым у рекламных систем меньше вопросов.</p>
              </li>
            </ul>
          </div>
        </section>

        {services.length > 0 && (
          <section className="border-b border-border bg-background">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Рекламные площадки</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to="/service/$slug"
                    params={{ slug: s.slug }}
                    className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">Реклама</div>
                    <div className="mt-1 font-serif text-lg font-bold text-primary">
                      {s.name}
                      {META_SLUGS.has(s.slug) && <sup className="ml-0.5 text-accent">*</sup>}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">Карты для оплаты {s.name} →</div>
                  </Link>
                ))}
              </div>
              {hasMeta && (
                <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                  * Компания Meta признана экстремистской организацией, её деятельность запрещена на территории РФ.
                </p>
              )}
            </div>
          </section>
        )}

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Частые вопросы про карты для рекламы</h2>
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
