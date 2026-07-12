import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_ROBOTS } from "@/lib/config";
import { sanitizeHtml } from "@/lib/sanitize";

type BankPage = {
  id: string;
  slug: string;
  title: string;
  h1: string;
  meta_title: string;
  meta_description: string;
  keyword: string;
  intro_text: string;
  content: string;
  priority: number;
  published: boolean;
};

const bankBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["bank_pages", "slug", slug],
    queryFn: async (): Promise<BankPage | null> => {
      const { data, error } = await supabase
        .from("bank_pages")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as BankPage | null) ?? null;
    },
  });

const banksSiblingsQueryOptions = queryOptions({
  queryKey: ["bank_pages", "siblings"],
  queryFn: async (): Promise<BankPage[]> => {
    const { data, error } = await supabase
      .from("bank_pages")
      .select("id,slug,title,h1,meta_title,meta_description,keyword,intro_text,content,priority,published")
      .eq("published", true)
      .order("priority", { ascending: false });
    if (error) throw error;
    return (data as BankPage[] | null) ?? [];
  },
});

type Faq = { q: string; a: string };
const FAQS_BY_SLUG: Record<string, Faq[]> = {
  debetovye: [
    {
      q: "Можно ли открыть дебетовую карту иностранного банка онлайн из России?",
      a: "В большинстве банков СНГ требуется личный визит и документы, подтверждающие адрес или статус нерезидента. Полностью онлайн-открытие «под ключ» встречается редко и требует дополнительной проверки источника средств.",
    },
    {
      q: "Нужно ли уведомлять ФНС об открытии счёта за рубежом?",
      a: "Да. Российский налоговый резидент обязан уведомить налоговую об открытии счёта в иностранном банке и ежегодно подавать отчёт о движении средств.",
    },
    {
      q: "Чем такая карта лучше виртуалки из рейтинга EraPay?",
      a: "Она даёт полноценный IBAN, приём SWIFT/SEPA-переводов, снятие наличных в банкоматах и стабильные лимиты. Для разовых онлайн-покупок и подписок это избыточно — виртуалка проще и дешевле.",
    },
  ],
  kreditnye: [
    {
      q: "Реально ли получить кредитную карту без ВНЖ и резидентства?",
      a: "В большинстве стран — нет. Отдельные банки СНГ рассматривают secured-карты с депозитом-обеспечением, но это экономически близко к дебетовой карте.",
    },
    {
      q: "Какие риски у кредитной карты иностранного банка?",
      a: "Высокие ставки, валютный риск при рублёвом доходе, короткий льготный период и жёсткие штрафы. При закрытии счёта банк может потребовать досрочного погашения.",
    },
    {
      q: "Что использовать вместо кредитной карты за рубежом?",
      a: "Для оплаты подписок, рекламы и покупок в иностранных магазинах подойдёт виртуальная карта из рейтинга EraPay — без резидентства и без кредитных обязательств.",
    },
  ],
  "s-keshbekom": [
    {
      q: "На что реально начисляется кэшбэк на карте иностранного банка?",
      a: "Чаще всего — на местные категории: продукты, кафе, транспорт. Онлайн-покупки в иностранных магазинах и подписки обычно идут по базовой ставке или исключены.",
    },
    {
      q: "Стоит ли оформлять зарубежную карту только ради кэшбэка?",
      a: "Обычно нет. Годовое обслуживание, конвертация и налоговая отчётность съедают выгоду. Смысл появляется, если вы и так живёте или работаете в этой стране.",
    },
    {
      q: "Есть ли кэшбэк у виртуальных карт из рейтинга EraPay?",
      a: "У части сервисов есть возврат комиссии или бонусные лимиты. Сравнить условия можно в рейтинге EraPay.",
    },
  ],
};

export const Route = createFileRoute("/banks/$slug")({
  head: ({ loaderData, params }) => {
    const p = loaderData as { page?: BankPage } | undefined;
    if (!p?.page) {
      return {
        meta: [{ title: "Страница не найдена · EraPay" }, { name: "robots", content: "noindex" }],
      };
    }
    const page = p.page;
    const url = `https://erapay.ru/banks/${params.slug}`;
    const faqs = FAQS_BY_SLUG[params.slug] ?? [];
    return {
      meta: [
        { title: page.meta_title || `${page.title} · EraPay` },
        { name: "description", content: page.meta_description || page.intro_text },
        { name: "keywords", content: page.keyword },
        { property: "og:title", content: page.meta_title || page.title },
        { property: "og:description", content: page.meta_description || page.intro_text },
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
            "@type": "Article",
            headline: page.h1,
            description: page.meta_description || page.intro_text,
            mainEntityOfPage: url,
            publisher: {
              "@type": "Organization",
              name: "EraPay",
              logo: { "@type": "ImageObject", url: "https://erapay.ru/apple-touch-icon.png" },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
              { "@type": "ListItem", position: 2, name: "Банковские карты", item: "https://erapay.ru/banks" },
              { "@type": "ListItem", position: 3, name: page.title, item: url },
            ],
          }),
        },
        ...(faqs.length > 0
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(bankBySlugQueryOptions(params.slug));
    if (!page) throw notFound();
    await context.queryClient.ensureQueryData(banksSiblingsQueryOptions);
    return { page };
  },
  component: BankArticlePage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Страница не найдена</h1>
        <p className="mt-3 text-muted-foreground">Такого обзора банковских карт пока нет.</p>
        <Link
          to="/banks"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          К банковским картам
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
});

function BankArticlePage() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery(bankBySlugQueryOptions(slug));
  const { data: siblings } = useSuspenseQuery(banksSiblingsQueryOptions);
  if (!page) return null;

  const others = siblings.filter((s) => s.slug !== page.slug).slice(0, 2);
  const faqs = FAQS_BY_SLUG[slug] ?? [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[760px] px-4 py-10 sm:px-6 lg:px-8">
            <nav
              aria-label="Хлебные крошки"
              className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
            >
              <Link to="/" className="hover:text-primary">
                Главная
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <Link to="/banks" className="hover:text-primary">
                Банковские карты
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">{page.title}</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              Обзор EraPay
            </div>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {page.h1}
            </h1>
            {page.intro_text && (
              <p className="mt-4 text-base leading-relaxed text-foreground/80">{page.intro_text}</p>
            )}
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:px-8">
            <article
              className="blog-content text-base leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(page.content) }}
            />

            {faqs.length > 0 && (
              <div className="mt-12">
                <h2 className="font-serif text-2xl font-bold text-primary">Частые вопросы</h2>
                <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-surface">
                  {faqs.map((f) => (
                    <div key={f.q} className="p-5">
                      <dt className="font-semibold text-primary">{f.q}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-foreground/80">{f.a}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <div className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                Проще и быстрее
              </div>
              <h3 className="mt-1 font-serif text-xl font-bold text-primary">
                Рейтинг зарубежных виртуальных карт EraPay
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Для подписок, рекламы и покупок в иностранных магазинах виртуалка обычно
                удобнее банковской карты — без визитов, ВНЖ и налоговых отчётов.
              </p>
              <Link
                to="/"
                hash="rating"
                className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                К рейтингу карт →
              </Link>
            </div>
          </div>
        </section>

        {others.length > 0 && (
          <section className="border-t border-border bg-surface">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Смотрите также
              </h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2">
                {others.map((o) => (
                  <li key={o.id}>
                    <Link
                      to="/banks/$slug"
                      params={{ slug: o.slug }}
                      className="flex h-full flex-col rounded-xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                        Банковская карта
                      </div>
                      <h3 className="mt-2 font-serif text-lg font-bold leading-snug text-primary">
                        {o.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {o.intro_text}
                      </p>
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