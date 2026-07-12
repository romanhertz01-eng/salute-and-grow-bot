import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { RatingSection } from "@/components/nhcard/Rating";
import { supabase } from "@/integrations/supabase/client";
import { cardsQueryOptions, type Card } from "@/lib/cards";
import { PUBLIC_ROBOTS } from "@/lib/config";

type CountryPage = {
  id: string;
  slug: string;
  name_ru: string;
  name_en: string;
  currency: string;
  region: string;
  flag_emoji: string;
  h1: string;
  meta_title: string;
  meta_description: string;
  intro_text: string | null;
  keyword: string;
  priority: number;
  published: boolean;
};

const countryPageBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["country_pages", slug],
    queryFn: async (): Promise<CountryPage | null> => {
      const { data, error } = await supabase
        .from("country_pages" as never)
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as CountryPage | null) ?? null;
    },
  });

const countryPagesByRegionQueryOptions = (region: string) =>
  queryOptions({
    queryKey: ["country_pages", "region", region],
    queryFn: async (): Promise<CountryPage[]> => {
      const { data, error } = await supabase
        .from("country_pages" as never)
        .select("*")
        .eq("region", region)
        .eq("published", true);
      if (error) throw error;
      return (data as CountryPage[] | null) ?? [];
    },
  });

function introFor(page: CountryPage): string {
  if (page.intro_text && page.intro_text.trim().length > 0) return page.intro_text;
  const { name_ru, currency, region } = page;
  switch (region) {
    case "СНГ":
      return `В ${name_ru} у россиян работают карты «Мир» — в супермаркетах, отелях и банкоматах. Но не везде: онлайн-сервисы, авиабилеты и часть ресторанов принимают только Visa и Mastercard. Ниже — карты из рейтинга EraPay, которыми пользователи закрывают все сценарии оплаты в ${name_ru} в валюте ${currency}.`;
    case "Европа":
      return `В ${name_ru} российские карты не принимают ни в одной точке — ни офлайн, ни онлайн. Единственный рабочий вариант — зарубежная виртуальная карта Visa или Mastercard с BIN нейтральной страны. Валюта оплаты — ${currency}. Ниже — карты EraPay, которые пользователи берут в поездку в ${name_ru}: без блокировок в отелях, ресторанах и Booking.`;
    case "Азия":
      return `В ${name_ru} российские карты не принимают. Visa и Mastercard иностранных банков работают в отелях, ресторанах и онлайне, во многих местах также принимают UnionPay. Локальная валюта — ${currency}, наличные пригодятся на рынках и в транспорте. Ниже — карты, которыми пользователи EraPay оплачивают поездки в ${name_ru}.`;
    case "Ближний Восток":
      return `В ${name_ru} российские карты не работают. Visa и Mastercard иностранных банков принимают в отелях, ресторанах и торговых центрах без ограничений, валюта расчётов — ${currency}. В такси и на рынках лучше иметь немного наличных. Ниже — карты EraPay, которые уверенно проходят в ${name_ru}.`;
    case "Африка":
      return `В ${name_ru} российские карты не принимают, а инфраструктура терминалов есть только в туристических зонах и крупных отелях. Visa и Mastercard иностранных банков работают, валюта расчётов — ${currency}. Значительную часть расходов удобнее закрывать наличными. Ниже — карты EraPay для поездки в ${name_ru}.`;
    case "Америка":
      return `В ${name_ru} российские карты полностью отключены от международных платёжных систем. Единственный вариант — зарубежная виртуальная Visa или Mastercard. Валюта расчётов — ${currency}. Ниже — карты EraPay, которые пользователи берут в ${name_ru}: с высокими лимитами и поддержкой предавторизации в отелях и прокате авто.`;
    default:
      return `Оплата в ${name_ru} российскими картами невозможна. Ниже — рейтинг зарубежных виртуальных карт EraPay для платежей в ${currency}.`;
  }
}

function faqFor(page: CountryPage): { q: string; a: string }[] {
  const { name_ru, currency, region } = page;
  const visaAnswer =
    region === "СНГ"
      ? `Да, Visa и Mastercard иностранных банков принимают в ${name_ru} без ограничений. Карты «Мир» работают в большинстве офлайн-точек, но онлайн-платежи и часть сервисов — только по Visa/Mastercard.`
      : region === "Азия"
        ? `Да, Visa и Mastercard иностранных банков работают в ${name_ru} в отелях, ресторанах и онлайне. Во многих сетях также принимают UnionPay — удобно для крупных покупок.`
        : `Да, Visa и Mastercard иностранных банков в ${name_ru} принимают. Карты российских банков отклоняются во всех точках, включая онлайн.`;
  return [
    {
      q: `Работают ли карты Visa и Mastercard в ${name_ru}?`,
      a: visaAnswer,
    },
    {
      q: `Какую карту брать в ${name_ru} в 2026 году?`,
      a: `Лучше всего работают виртуальные карты с BIN нейтральных стран (Армения, Казахстан, Кипр, Гонконг) — они проходят в терминалах, онлайн и выдерживают hold в отелях. Конкретные варианты — в верхней части рейтинга выше, с тарифами и скоростью выпуска.`,
    },
    {
      q: `Нужны ли наличные в ${name_ru}?`,
      a: `Небольшой запас наличных в ${currency} стоит иметь на такси, рынки, транспорт и чаевые. Крупные покупки — отели, аренда авто, рестораны — удобнее оплачивать картой: и по курсу выгоднее, и hold возвращается быстрее.`,
    },
    {
      q: `Есть ли комиссия за конвертацию в ${currency}?`,
      a: `Комиссия зависит от эмитента карты. У карт из верхней части рейтинга EraPay курс близок к межбанку, скрытых наценок нет — точные тарифы указаны в карточке каждой карты.`,
    },
  ];
}

function prioritizeCards(cards: Card[], countrySlug: string): Card[] {
  const sorted = [...cards].sort((a, b) => a.rank - b.rank);
  if (countrySlug === "china" || countrySlug === "hong-kong") {
    return sorted
      .slice()
      .sort((a, b) => {
        const aUp = (a.payment_system ?? "").toLowerCase().includes("unionpay") ? -1 : 0;
        const bUp = (b.payment_system ?? "").toLowerCase().includes("unionpay") ? -1 : 0;
        return aUp - bUp || a.rank - b.rank;
      })
      .slice(0, 5);
  }
  return sorted.slice(0, 5);
}

export const Route = createFileRoute("/country/$slug")({
  head: ({ loaderData }) => {
    const p = loaderData as { page?: CountryPage } | undefined;
    if (!p?.page) {
      return { meta: [{ title: "Страна не найдена · EraPay" }, { name: "robots", content: "noindex" }] };
    }
    const page = p.page;
    const url = `https://erapay.ru/country/${page.slug}`;
    return {
      meta: [
        { title: page.meta_title },
        { name: "description", content: page.meta_description },
        { name: "keywords", content: page.keyword },
        { property: "og:title", content: page.meta_title },
        { property: "og:description", content: page.meta_description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "robots", content: PUBLIC_ROBOTS },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
              { "@type": "ListItem", position: 2, name: "Карты по странам", item: "https://erapay.ru/#countries" },
              { "@type": "ListItem", position: 3, name: page.name_ru, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqFor(page).map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(countryPageBySlugQueryOptions(params.slug));
    if (!page) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(cardsQueryOptions),
      context.queryClient.ensureQueryData(countryPagesByRegionQueryOptions(page.region)),
    ]);
    return { page };
  },
  component: CountryPageView,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Страна не найдена</h1>
        <p className="mt-3 text-muted-foreground">Такой страны пока нет в базе EraPay.</p>
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

function CountryPageView() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery(countryPageBySlugQueryOptions(slug));
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
  const { data: neighbors } = useSuspenseQuery(countryPagesByRegionQueryOptions(page?.region ?? ""));

  if (!page) return null;

  const topCards = prioritizeCards(cards, page.slug);
  const relatedOthers = neighbors.filter((n) => n.slug !== page.slug).slice(0, 4);
  const faq = faqFor(page);
  const intro = introFor(page);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-10 sm:px-6 lg:px-8">
            <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Главная</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <Link to="/" hash="countries" className="hover:text-primary">Карты по странам</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">{page.name_ru}</span>
            </nav>

            <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-accent">
              <span aria-hidden="true" className="text-2xl leading-none">{page.flag_emoji}</span>
              <span>{page.region} · Валюта: {page.currency}</span>
            </div>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {intro}
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Топ-5 карт для оплаты в {page.name_ru}
              </h2>
              <Link to="/" hash="rating" className="shrink-0 text-sm font-semibold text-accent hover:underline">
                Весь рейтинг →
              </Link>
            </div>
          </div>
          <RatingSection cards={topCards} />
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Как платить в {page.name_ru}
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { t: "Возьмите две карты", d: `Основная — Visa или Mastercard из рейтинга для оплаты в ${page.currency}, запасная — с другим BIN на случай отказа терминала.` },
                { t: "Пополните заранее", d: "Переведите рубли через СБП до вылета — конвертация и зачисление занимают минуты, но лучше не делать это в аэропорту." },
                { t: "Держите наличные", d: `Небольшой запас в ${page.currency} на такси, транспорт и рынки. В крупных сетях и отелях удобнее платить картой.` },
                { t: "Проверьте бесконтакт", d: "Apple Pay / Google Pay работают там, где принимает физическая карта эмитента — уточните поддержку в карточке карты." },
              ].map((s, i) => (
                <li key={s.t} className="rounded-lg border border-border bg-background p-5 shadow-sm">
                  <div className="font-serif text-2xl font-bold text-accent">{i + 1}</div>
                  <div className="mt-2 font-semibold text-primary">{s.t}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Частые вопросы про оплату в {page.name_ru}
            </h2>
            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-background shadow-sm">
              {faq.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none text-base font-semibold text-primary marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {relatedOthers.length > 0 && (
          <section className="border-b border-border bg-surface">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Соседние страны
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ещё направления региона «{page.region}».
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {relatedOthers.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/country/$slug"
                      params={{ slug: r.slug }}
                      className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
                        <span aria-hidden="true" className="text-lg leading-none">{r.flag_emoji}</span>
                        <span>{r.currency}</span>
                      </div>
                      <div className="mt-1 font-serif text-lg font-bold text-primary">{r.name_ru}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Карты для оплаты в {r.name_ru} →</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}