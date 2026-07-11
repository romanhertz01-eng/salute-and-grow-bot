import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { supabase } from "@/integrations/supabase/client";
import { cardsQueryOptions, formatToday } from "@/lib/cards";

type GuidePage = {
  id: string;
  slug: string;
  guide_type: "service" | "country";
  target_name: string;
  h1: string;
  meta_title: string;
  meta_description: string;
  keyword: string;
  priority: number;
  published: boolean;
  related_slug: string;
};

const guideBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["guide_pages", slug],
    queryFn: async (): Promise<GuidePage | null> => {
      const { data, error } = await supabase
        .from("guide_pages" as never)
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as GuidePage | null) ?? null;
    },
  });

const guidesByTypeQueryOptions = (guide_type: "service" | "country") =>
  queryOptions({
    queryKey: ["guide_pages", "type", guide_type],
    queryFn: async (): Promise<GuidePage[]> => {
      const { data, error } = await supabase
        .from("guide_pages" as never)
        .select("*")
        .eq("guide_type", guide_type)
        .eq("published", true);
      if (error) throw error;
      return (data as GuidePage[] | null) ?? [];
    },
  });

type Step = { t: string; d: string };

function stepsFor(page: GuidePage): Step[] {
  const n = page.target_name;
  if (page.guide_type === "service") {
    return [
      {
        t: `Выберите карту под ${n}`,
        d: `Откройте рейтинг EraPay и подберите зарубежную виртуальную карту с подходящим BIN, лимитами и стоимостью обслуживания — карту, у которой пользователи уже успешно оплачивали ${n}.`,
      },
      {
        t: "Оформите выпуск",
        d: `Пройдите регистрацию у эмитента и выпустите карту. У большинства сервисов из рейтинга это занимает 5–15 минут и не требует полного KYC.`,
      },
      {
        t: "Пополните через СБП",
        d: `Переведите рубли на карту через СБП или банковский перевод — эмитент автоматически конвертирует их в валюту баланса карты по курсу, указанному в тарифе.`,
      },
      {
        t: "Настройте регион аккаунта",
        d: `Если ${n} требует зарубежный регион аккаунта, поменяйте страну в настройках профиля самого сервиса на страну эмитента карты — это законная опция в личном кабинете, а не обход блокировок.`,
      },
      {
        t: `Оплатите ${n}`,
        d: `Введите данные виртуальной карты в форме оплаты ${n}. Платёж проходит как обычная зарубежная транзакция — 3-D Secure придёт SMS или push от эмитента.`,
      },
      {
        t: "Если платёж отклонён",
        d: `Проверьте баланс, лимиты и корректность billing-адреса. Если ${n} не открывает страницу оплаты из-за региональных ограничений — воспользуйтесь легальными способами, доступными в самой платформе (смена страны в настройках, региональные тарифы). Не используйте инструменты обхода санкций и подделки геолокации.`,
      },
    ];
  }
  return [
    {
      t: `Какие карты брать в ${n}`,
      d: `Возьмите минимум две зарубежные карты разных платёжных систем (Visa и Mastercard) из рейтинга EraPay — так вы застрахованы, если одна не сработает на кассе или в банкомате в ${n}.`,
    },
    {
      t: "Наличные и валюта",
      d: `Держите небольшой запас наличных в местной валюте на первые сутки — на такси из аэропорта, чаевые и рынки, где карты не принимают. Крупные суммы наличных везти невыгодно: курс обмена в ${n} обычно хуже, чем конвертация по карте.`,
    },
    {
      t: "Пополнение до поездки",
      d: `Пополните карты через СБП до вылета с запасом на всю поездку плюс 15–20% — это защита от роуминговых списаний и авторизаций отелей. Проверьте, что карта поддерживает мультивалюту, чтобы не терять на двойной конвертации в ${n}.`,
    },
    {
      t: "Снятие в банкоматах",
      d: `Снимайте крупные суммы разово, чтобы не платить комиссию за каждую операцию. Уточните лимиты своей карты и лимиты банкомата в ${n} — они часто ниже привычных. Всегда выбирайте списание в местной валюте, а не в рублях (DCC), — курс банкомата хуже.`,
    },
    {
      t: "Бесконтакт и онлайн",
      d: `Добавьте карту в Apple Pay или Google Pay заранее — в ${n} бесконтактная оплата принимается почти везде. Для онлайн-оплат внутри страны (доставка, транспорт, музеи) виртуальная карта работает без ограничений.`,
    },
  ];
}

function faqFor(page: GuidePage): { q: string; a: string }[] {
  const n = page.target_name;
  if (page.guide_type === "service") {
    return [
      {
        q: `Можно ли оплатить ${n} российской картой?`,
        a: `Напрямую нельзя: ${n} отклоняет карты с BIN РФ. Работают только зарубежные виртуальные карты — их выпускают за 5–15 минут и пополняют через СБП.`,
      },
      {
        q: `Нужен ли VPN для оплаты ${n}?`,
        a: `Для самой оплаты — обычно нет. VPN может понадобиться только для доступа к странице оплаты ${n}, если сервис недоступен из РФ. Используйте только легальные способы и не пытайтесь обходить санкционные ограничения.`,
      },
      {
        q: `Что делать, если платёж в ${n} не проходит?`,
        a: `Проверьте баланс, лимиты и 3-D Secure карты. Если ${n} по-прежнему отклоняет платёж — попробуйте карту с другим BIN из рейтинга EraPay: разные страны эмитента дают разный результат.`,
      },
    ];
  }
  return [
    {
      q: `Работают ли российские карты в ${n}?`,
      a: `Карты Visa и Mastercard, выпущенные в РФ, не работают в ${n} с 2022 года. Для оплаты нужна карта зарубежного банка — виртуальная карта EraPay подходит для покупок, отелей и снятия наличных.`,
    },
    {
      q: `Сколько наличных брать в ${n}?`,
      a: `Запаса на 1–2 дня достаточно: такси, чаевые, локальные рынки. Всё остальное выгоднее оплачивать картой — курс конвертации у эмитента лучше, чем у обменников в ${n}.`,
    },
    {
      q: `Можно ли снимать в банкоматах ${n}?`,
      a: `Да, зарубежные карты из рейтинга EraPay работают в банкоматах ${n}. Снимайте крупными суммами, выбирайте списание в местной валюте (не в рублях) и уточняйте комиссию карты за снятие за рубежом.`,
    },
  ];
}

export const Route = createFileRoute("/guides/$slug")({
  head: ({ loaderData }) => {
    const p = loaderData as { page?: GuidePage } | undefined;
    if (!p?.page) {
      return {
        meta: [{ title: "Гайд не найден · EraPay" }, { name: "robots", content: "noindex" }],
      };
    }
    const page = p.page;
    const url = `https://erapay.ru/guides/${page.slug}`;
    const steps = stepsFor(page);
    const faq = faqFor(page);
    return {
      meta: [
        { title: page.meta_title },
        { name: "description", content: page.meta_description },
        { name: "keywords", content: page.keyword },
        { property: "og:title", content: page.meta_title },
        { property: "og:description", content: page.meta_description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "robots", content: "index, follow" },
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
              { "@type": "ListItem", position: 2, name: "Гайды", item: "https://erapay.ru/guides" },
              { "@type": "ListItem", position: 3, name: page.h1, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: page.h1,
            description: page.meta_description,
            step: steps.map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.t,
              text: s.d,
            })),
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
    };
  },
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(guideBySlugQueryOptions(params.slug));
    if (!page) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(cardsQueryOptions),
      context.queryClient.ensureQueryData(guidesByTypeQueryOptions(page.guide_type)),
    ]);
    return { page };
  },
  component: GuidePageView,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Гайд не найден</h1>
        <p className="mt-3 text-muted-foreground">Такой инструкции пока нет в базе EraPay.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
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

function GuidePageView() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery(guideBySlugQueryOptions(slug));
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
  const { data: allGuides } = useSuspenseQuery(
    guidesByTypeQueryOptions(page?.guide_type ?? "service"),
  );

  if (!page) return null;

  const steps = stepsFor(page);
  const faq = faqFor(page);
  const topCards = [...cards].sort((a, b) => a.rank - b.rank).slice(0, 2);
  const otherGuides = allGuides.filter((g) => g.slug !== page.slug).slice(0, 4);
  const kicker = page.guide_type === "service" ? "Гайд · Оплата сервиса" : "Гайд · Оплата за рубежом";

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[820px] px-4 py-10 sm:px-6 lg:px-8">
            <nav
              aria-label="Хлебные крошки"
              className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
            >
              <Link to="/" className="hover:text-primary">
                Главная
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="hover:text-primary">Гайды</span>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">{page.target_name}</span>
            </nav>

            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              {kicker}
            </div>
            <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Обновлено {formatToday()} · Автор — Дмитрий Соколовский, редактор EraPay
            </p>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {page.meta_description}
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Пошаговая инструкция
            </h2>
            <ol className="mt-6 space-y-4">
              {steps.map((s, i) => (
                <li
                  key={s.t}
                  className="rounded-lg border border-border bg-surface p-5 shadow-sm"
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-2xl font-bold text-accent">
                      {i + 1}
                    </span>
                    <span className="font-semibold text-primary">{s.t}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.d}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {topCards.length > 0 && (
          <section className="border-b border-border bg-surface">
            <div className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Рекомендуем карту
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Две карты из топа рейтинга EraPay — подойдут для{" "}
                {page.guide_type === "service"
                  ? `оплаты ${page.target_name}`
                  : `поездки в ${page.target_name}`}.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {topCards.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/cards/$slug"
                      params={{ slug: c.slug }}
                      className="block rounded-lg border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                        #{c.rank} в рейтинге
                      </div>
                      <div className="mt-1 font-serif text-lg font-bold text-primary">
                        {c.name}
                      </div>
                      <div className="mt-2 text-xs text-muted-foreground">
                        Подробнее о карте →
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link
                  to="/"
                  hash="rating"
                  className="text-sm font-semibold text-accent hover:underline"
                >
                  Весь рейтинг карт →
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[820px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-border bg-surface p-5 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                Смотрите также
              </div>
              {page.guide_type === "service" ? (
                <Link
                  to="/service/$slug"
                  params={{ slug: page.related_slug }}
                  className="mt-1 block font-serif text-lg font-bold text-primary hover:underline"
                >
                  Рейтинг карт для оплаты {page.target_name} →
                </Link>
              ) : (
                <Link
                  to="/country/$slug"
                  params={{ slug: page.related_slug }}
                  className="mt-1 block font-serif text-lg font-bold text-primary hover:underline"
                >
                  Рейтинг карт для {page.target_name} →
                </Link>
              )}
            </div>
          </div>
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[820px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Частые вопросы
            </h2>
            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-background shadow-sm">
              {faq.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none text-base font-semibold text-primary marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {otherGuides.length > 0 && (
          <section className="border-b border-border bg-background">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Другие гайды
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {otherGuides.map((g) => (
                  <li key={g.slug}>
                    <Link
                      to="/guides/$slug"
                      params={{ slug: g.slug }}
                      className="block rounded-lg border border-border bg-surface p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {g.guide_type === "service" ? "Оплата сервиса" : "Оплата за рубежом"}
                      </div>
                      <div className="mt-1 font-serif text-base font-bold text-primary">
                        {g.h1}
                      </div>
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