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

const URL_ = "https://erapay.ru/shopping-cards";
const TITLE = "Карты для покупок в иностранных магазинах в 2026 году";
const DESC =
  "Иностранные виртуальные карты для покупок в Amazon, eBay, AliExpress, iHerb и Etsy: billing-адрес, AVS, доставка через посредников.";
const SERVICE_SLUGS = ["amazon", "ebay", "aliexpress", "iherb", "etsy"] as const;

const faq: { q: string; a: string }[] = [
  {
    q: "Что такое AVS и почему магазин отклоняет оплату?",
    a: "AVS (Address Verification System) сверяет billing-адрес карты с адресом в форме оплаты. Если данные не совпадают — банк держателя или магазин отклоняет транзакцию. Указывайте billing-адрес именно тот, что привязан к карте у эмитента.",
  },
  {
    q: "Какой billing-адрес указывать при оформлении карты?",
    a: "У большинства зарубежных карт billing-адрес формируется автоматически — из страны эмитента с валидным индексом. Использовать российский адрес в billing нельзя: AVS не пройдёт и оплата не проведётся.",
  },
  {
    q: "Как заказать товар в Россию через посредника?",
    a: "В billing указывайте адрес эмитента карты, в shipping — склад посредника в стране магазина (Shipito, Pochtabox, Boxberry Global и т. п.). Магазин видит совпадение billing и BIN и одобряет платёж, а физическая доставка идёт на склад посредника.",
  },
  {
    q: "В какой валюте лучше оплачивать зарубежный заказ?",
    a: "Всегда выбирайте валюту магазина (USD в Amazon US, EUR в европейских магазинах). Двойная конвертация «валюта магазина → рубли → валюта карты» обычно дороже прямой конвертации на стороне карты.",
  },
  {
    q: "Что делать, если платёж проходит, а магазин отменяет заказ?",
    a: "Магазин может отменить заказ, если IP-адрес, регион аккаунта и BIN карты противоречат друг другу. Заходите в магазин с IP-адреса страны карты (или без прокси), оформляйте аккаунт заранее с корректным адресом и оплачивайте небольшую сумму первой покупкой.",
  },
];

export const Route = createFileRoute("/shopping-cards")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "карта для покупок за границей, amazon, ebay, aliexpress, iherb, etsy, avs, billing адрес" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { property: "og:url", content: URL_ },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: PUBLIC_ROBOTS },
    ],
    links: [{ rel: "canonical", href: URL_ }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({ "@context": "https://schema.org", "@type": "WebPage", name: TITLE, description: DESC, url: URL_ }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
            { "@type": "ListItem", position: 2, name: "Карты для покупок", item: URL_ },
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
  component: ShoppingCardsPage,
});

function ShoppingCardsPage() {
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
              <span className="text-foreground">Карты для покупок</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">Подборка · Покупки</div>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Карты для покупок в иностранных магазинах в 2026 году
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Amazon, eBay, AliExpress и iHerb не принимают карты российских банков и на этапе оформления заказа
              сверяют billing-адрес с BIN карты (AVS). Ниже — иностранные виртуальные карты, у которых адрес и BIN
              согласованы, поэтому магазин не отменяет платёж, а посылку можно направить через посредника.
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Топ-5 карт для зарубежных магазинов</h2>
              <Link to="/" hash="rating" className="shrink-0 text-sm font-semibold text-accent hover:underline">
                Весь рейтинг →
              </Link>
            </div>
          </div>
          <RatingSection cards={top} />
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Как выбрать карту под магазин</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Валюта магазина</div>
                <p className="mt-2 text-sm text-muted-foreground">Для Amazon US и eBay — карта в USD, для европейских магазинов — EUR. Оплата в валюте магазина исключает двойную конвертацию.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">AVS и billing-адрес</div>
                <p className="mt-2 text-sm text-muted-foreground">Магазин сверяет billing-адрес с адресом, привязанным к карте у эмитента. У карт в рейтинге адрес корректный и AVS не блокирует платёж.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Лимит на разовую покупку</div>
                <p className="mt-2 text-sm text-muted-foreground">Магазин делает предавторизацию на полную сумму — держите лимит карты выше стоимости заказа с запасом на комиссию.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Доставка через посредника</div>
                <p className="mt-2 text-sm text-muted-foreground">В billing указывайте адрес эмитента, в shipping — склад посредника в стране магазина (Shipito, Pochtabox и др.).</p>
              </li>
            </ul>
          </div>
        </section>

        {services.length > 0 && (
          <section className="border-b border-border bg-background">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Магазины</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to="/service/$slug"
                    params={{ slug: s.slug }}
                    className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">Покупки</div>
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
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Частые вопросы про покупки за границей</h2>
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
