import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { RatingSection } from "@/components/nhcard/Rating";
import { supabase } from "@/integrations/supabase/client";
import { cardsQueryOptions } from "@/lib/cards";
import { PUBLIC_ROBOTS } from "@/lib/config";

type ServicePage = {
  id: string;
  slug: string;
  name: string;
  category: string;
  h1: string;
  meta_title: string;
  meta_description: string;
  intro_text: string | null;
  keyword: string;
  priority: number;
  published: boolean;
};

const servicePageBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["service_pages", slug],
    queryFn: async (): Promise<ServicePage | null> => {
      const { data, error } = await supabase
        .from("service_pages" as never)
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as ServicePage | null) ?? null;
    },
  });

const servicePagesByCategoryQueryOptions = (category: string) =>
  queryOptions({
    queryKey: ["service_pages", "category", category],
    queryFn: async (): Promise<ServicePage[]> => {
      const { data, error } = await supabase
        .from("service_pages" as never)
        .select("*")
        .eq("category", category)
        .eq("published", true);
      if (error) throw error;
      return (data as ServicePage[] | null) ?? [];
    },
  });

function introFor(page: ServicePage): string {
  if (page.intro_text && page.intro_text.trim().length > 0) return page.intro_text;
  const n = page.name;
  switch (page.category) {
    case "ai":
      return `Оплатить ${n} российской картой невозможно — сервис не принимает карты РФ и отклоняет платежи по BIN 220. Ниже — зарубежные виртуальные карты, которыми пользователи EraPay успешно оплачивают подписку ${n}. Мы сверили комиссии, лимиты и скорость выпуска, чтобы вы могли активировать доступ за один вечер.`;
    case "streaming":
      return `Подписка ${n} из России не оформляется: сервис проверяет регион карты и блокирует платёж. Мы собрали виртуальные карты с BIN нейтральных стран, которые принимает ${n} без запросов дополнительной верификации, — с прозрачными тарифами и пополнением через СБП.`;
    case "games":
      return `${n} не принимает карты российских банков и региональные кошельки Steam/PSN давно отвязаны от рубля. В подборке — зарубежные виртуальные карты, которые проходят в ${n} без ошибки «Payment declined», с быстрым пополнением и удобной валютой баланса.`;
    case "shopping":
      return `${n} отклоняет карты РФ на этапе оформления заказа и часто требует адресную верификацию (AVS). Мы отобрали виртуальные карты с корректным billing-адресом и достаточным лимитом, чтобы покупки в ${n} проходили с первой попытки.`;
    case "ads":
      return `Пополнение рекламного кабинета ${n} из России — отдельная задача: нужны высокие лимиты, автосписания и BIN, который не триггерит модерацию. В рейтинге — карты, которые арбитражники и агентства используют для ${n} без блокировок и «слётов» кабинетов.`;
    case "travel":
      return `${n} проводит предавторизацию суммы и требует, чтобы карта принадлежала клиенту. Виртуальные карты для ${n} должны выдерживать hold на всю стоимость брони и работать в мультивалюте — мы отобрали именно такие, с проверенной репутацией у отелей и авиакомпаний.`;
    case "work":
      return `Подписка ${n} требует стабильной карты для регулярных списаний: любое отклонение — и доступ к аккаунту приостанавливается. В рейтинге — зарубежные виртуальные карты, которые ${n} списывает без сбоев, с прозрачным обслуживанием и понятным пополнением.`;
    default:
      return `Оплата ${n} из России в 2026 году возможна через зарубежные виртуальные карты. Ниже — рейтинг проверенных вариантов с тарифами, лимитами и способами пополнения.`;
  }
}

function faqFor(name: string): { q: string; a: string }[] {
  return [
    {
      q: `Можно ли оплатить ${name} из России в 2026 году?`,
      a: `Оплатить ${name} российской картой напрямую нельзя — сервис отклоняет платежи по BIN РФ. Используйте зарубежную виртуальную карту из нашего рейтинга: пополните её через СБП и оплатите ${name} в один клик.`,
    },
    {
      q: `Какая карта лучше подходит для ${name}?`,
      a: `Лучше всего работают карты с BIN нейтральных стран (Армения, Казахстан, Кипр, Гонконг), быстрым выпуском и низкой комиссией на пополнение. В верхней части рейтинга — карты, которые редакция EraPay протестировала на ${name} лично.`,
    },
    {
      q: `Нужен ли VPN, чтобы оплатить ${name}?`,
      a: `Для большинства сервисов VPN не обязателен, но при первой оплате ${name} рекомендуем включить VPN страны выпуска карты — это снижает риск ручной проверки платежа.`,
    },
    {
      q: `Что делать, если платёж в ${name} отклонён?`,
      a: `Проверьте баланс и лимиты карты, включите VPN страны эмитента и повторите попытку через 15–30 минут. Если платёж по-прежнему не проходит — выберите другую карту из рейтинга: разные BIN дают разный результат.`,
    },
  ];
}

const CATEGORY_LABEL: Record<string, string> = {
  ai: "AI и нейросети",
  streaming: "Стриминг и медиа",
  games: "Игры",
  shopping: "Магазины",
  ads: "Реклама",
  travel: "Путешествия",
  work: "Работа и SaaS",
};

export const Route = createFileRoute("/service/$slug")({
  head: ({ loaderData }) => {
    const p = loaderData as { page?: ServicePage } | undefined;
    if (!p?.page) {
      return { meta: [{ title: "Сервис не найден · EraPay" }, { name: "robots", content: "noindex" }] };
    }
    const page = p.page;
    const url = `https://erapay.ru/service/${page.slug}`;
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
              { "@type": "ListItem", position: 2, name: "Карты для сервисов", item: "https://erapay.ru/service" },
              { "@type": "ListItem", position: 3, name: page.name, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqFor(page.name).map((f) => ({
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
    const page = await context.queryClient.ensureQueryData(servicePageBySlugQueryOptions(params.slug));
    if (!page) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(cardsQueryOptions),
      context.queryClient.ensureQueryData(servicePagesByCategoryQueryOptions(page.category)),
    ]);
    return { page };
  },
  component: ServicePage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Страница сервиса не найдена</h1>
        <p className="mt-3 text-muted-foreground">Такого сервиса пока нет в базе EraPay.</p>
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

function ServicePage() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery(servicePageBySlugQueryOptions(slug));
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
  const { data: related } = useSuspenseQuery(servicePagesByCategoryQueryOptions(page?.category ?? ""));

  if (!page) return null;

  const topCards = [...cards].sort((a, b) => a.rank - b.rank).slice(0, 5);
  const relatedOthers = related.filter((r) => r.slug !== page.slug).slice(0, 4);
  const faq = faqFor(page.name);
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
              <span className="hover:text-primary">Карты для сервисов</span>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">{page.name}</span>
            </nav>

            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              {CATEGORY_LABEL[page.category] ?? "Сервис"}
            </div>
            <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
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
                Топ-5 карт для оплаты {page.name}
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
              Как оплатить {page.name} из России
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { t: "Выберите карту", d: `Отсортируйте рейтинг по цене или скорости и выберите подходящую под ${page.name}.` },
                { t: "Оформите выпуск", d: "Пройдите регистрацию у эмитента. У большинства карт из рейтинга KYC не требуется." },
                { t: "Пополните через СБП", d: "Переведите рубли через СБП — карта автоматически конвертирует их в валюту баланса." },
                { t: `Оплатите ${page.name}`, d: `Введите данные карты в форме оплаты ${page.name} — платёж проходит как обычная зарубежная транзакция.` },
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
              Частые вопросы про оплату {page.name}
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
                Похожие сервисы
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ещё карты для {CATEGORY_LABEL[page.category]?.toLowerCase() ?? "этой категории"}.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {relatedOthers.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/service/$slug"
                      params={{ slug: r.slug }}
                      className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {CATEGORY_LABEL[r.category] ?? "Сервис"}
                      </div>
                      <div className="mt-1 font-serif text-lg font-bold text-primary">{r.name}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Карты для оплаты {r.name} →</div>
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