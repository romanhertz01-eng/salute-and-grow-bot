import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { cardsQueryOptions, type Card } from "@/lib/cards";
import { CardLogo } from "@/components/nhcard/CardLogo";
import { PUBLIC_ROBOTS } from "@/lib/config";

type NetSlug = "visa" | "mastercard";

const NETWORKS: Record<NetSlug, {
  name: string;
  intro: string;
  regex: RegExp;
  faq: { q: string; a: string }[];
}> = {
  visa: {
    name: "Visa",
    intro:
      "Visa — крупнейшая международная платёжная система, принимается в более чем 200 странах. Для россиян карты Visa от зарубежных эмитентов остаются рабочим инструментом для оплаты подписок, зарубежных сервисов и поездок.",
    regex: /visa/i,
    faq: [
      {
        q: "Чем Visa отличается от Mastercard?",
        a: "Технически обе системы похожи: приняты почти везде, поддерживают 3-D Secure и токенизацию. Отличия чаще в бонусах эмитента и в валютной конвертации: у Visa расчёт идёт через доллар США, у Mastercard — часто через евро.",
      },
      {
        q: "Какие карты Visa работают из России?",
        a: "Работают виртуальные карты Visa, выпущенные зарубежными эмитентами и финтех-провайдерами. Российские Visa-карты за рубежом и в интернете не принимаются с 2022 года.",
      },
      {
        q: "Где принимают Visa?",
        a: "Практически везде за пределами РФ: онлайн-сервисы, магазины, отели, транспорт. Внутри России Visa от зарубежных банков работает только для оплаты в интернете и за границей.",
      },
    ],
  },
  mastercard: {
    name: "Mastercard",
    intro:
      "Mastercard — вторая крупнейшая мировая платёжная система, принимается наравне с Visa. Виртуальные Mastercard от зарубежных банков популярны у россиян для оплаты Netflix, Spotify, AI-подписок и путешествий.",
    regex: /mastercard/i,
    faq: [
      {
        q: "Чем Mastercard отличается от Visa?",
        a: "Обе системы работают в 200+ странах. У Mastercard валютная конвертация часто идёт через евро — это выгоднее в Европе. У Visa — через доллар США, что удобнее для покупок в США.",
      },
      {
        q: "Какие Mastercard работают из России?",
        a: "Виртуальные Mastercard от зарубежных эмитентов (европейских и азиатских финтех-провайдеров). Российские Mastercard за рубежом и на иностранных сайтах не принимаются с 2022 года.",
      },
      {
        q: "Где принимают Mastercard?",
        a: "Везде, где есть логотип Mastercard: онлайн-магазины, стриминги, отели, транспорт. Внутри России — только для оплаты в интернете на иностранных сайтах.",
      },
    ],
  },
};

export const Route = createFileRoute("/network/$slug")({
  head: ({ loaderData }) => {
    const data = loaderData as { slug: NetSlug; name: string } | undefined;
    if (!data) return { meta: [{ title: "Платёжная система" }] };
    const url = `https://erapay.ru/network/${data.slug}`;
    const title = `Виртуальная карта ${data.name} для россиян в 2026 году · EraPay`;
    const description = `Как оформить и использовать виртуальную карту ${data.name} из России: топ карт, тарифы, где принимают. Проверено редакцией EraPay.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
        { name: "robots", content: PUBLIC_ROBOTS },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  loader: async ({ context, params }) => {
    if (params.slug !== "visa" && params.slug !== "mastercard") throw notFound();
    await context.queryClient.ensureQueryData(cardsQueryOptions);
    const net = NETWORKS[params.slug as NetSlug];
    return { slug: params.slug as NetSlug, name: net.name };
  },
  component: NetworkPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Страница не найдена</h1>
        <Link to="/" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">
          На главную
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
});

function NetworkPage() {
  const { slug } = Route.useParams();
  const net = NETWORKS[slug as NetSlug];
  const { data: allCards = [] } = useSuspenseQuery(cardsQueryOptions);

  const filtered = (allCards as Card[])
    .filter((c) => net.regex.test(c.payment_system ?? ""))
    .slice(0, 5);

  const url = `https://erapay.ru/network/${slug}`;
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
      { "@type": "ListItem", position: 2, name: "Платёжные системы", item: "https://erapay.ru/network" },
      { "@type": "ListItem", position: 3, name: net.name, item: url },
    ],
  };
  const webPageLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Виртуальные карты ${net.name} для россиян`,
    url,
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: net.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />

      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Главная</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <Link to="/network" className="hover:text-primary">Платёжные системы</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">{net.name}</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              Платёжная система
            </div>
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Виртуальные карты {net.name} для россиян в 2026 году
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/85">{net.intro}</p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1040px] px-4 py-14 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Топ карт {net.name}
              </h2>
              <Link to="/" hash="rating" className="text-sm font-semibold text-accent hover:underline">
                Весь рейтинг →
              </Link>
            </div>

            {filtered.length === 0 ? (
              <p className="mt-6 text-sm text-muted-foreground">
                В нашей базе пока нет карт {net.name}. Загляните в общий рейтинг.
              </p>
            ) : (
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/cards/$slug"
                      params={{ slug: c.slug }}
                      className="block h-full rounded-lg border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <CardLogo name={c.name} logoUrl={c.logo_url} logoDomain={c.logo_domain} size={40} />
                        <div className="font-serif text-lg font-bold text-primary">
                          {Number(c.editorial_score).toFixed(1)}
                        </div>
                      </div>
                      <div className="mt-3 font-serif text-lg font-bold text-primary">{c.name}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {c.payment_system}
                        {c.issuer_country ? ` · ${c.issuer_country}` : ""}
                      </div>
                      {c.verified && (
                        <div className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-accent">
                          <ShieldCheck className="h-3 w-3" /> Проверено
                        </div>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Как выбрать карту {net.name}
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              <li className="rounded-lg border border-border bg-background p-5">
                <div className="font-serif text-lg font-bold text-primary">1. Проверьте эмитента</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Убедитесь, что карта выпускается зарубежным банком — только такие принимаются на иностранных сайтах.
                </p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5">
                <div className="font-serif text-lg font-bold text-primary">2. Сравните тарифы</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Стоимость выпуска, обслуживания и комиссию на пополнение — эти три параметра решают всё.
                </p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5">
                <div className="font-serif text-lg font-bold text-primary">3. Способ пополнения</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Самый удобный сценарий из России — пополнение через СБП без комиссии посредника.
                </p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5">
                <div className="font-serif text-lg font-bold text-primary">4. Валюта карты</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Для подписок обычно достаточно USD; для Европы удобнее EUR — экономите на конвертации.
                </p>
              </li>
            </ol>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-[1040px] px-4 py-14 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Частые вопросы</h2>
            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-background">
              {net.faq.map((f) => (
                <details key={f.q} className="group p-5">
                  <summary className="cursor-pointer list-none font-serif text-lg font-semibold text-primary">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/85">{f.a}</p>
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