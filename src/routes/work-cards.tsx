import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { RatingSection } from "@/components/nhcard/Rating";
import { cardsQueryOptions } from "@/lib/cards";
import { PUBLIC_ROBOTS } from "@/lib/config";
import { publishedServicesQueryOptions } from "@/lib/service-links";

const URL_ = "https://erapay.ru/work-cards";
const TITLE = "Карты для оплаты SaaS и рабочих сервисов в 2026 году";
const DESC =
  "Иностранные карты для оплаты Adobe, Figma, Notion, GitHub, JetBrains и других SaaS: годовые подписки, VAT, бизнес-аккаунты.";
const SERVICE_SLUGS = ["adobe", "figma", "notion", "github", "jetbrains"] as const;

const faq: { q: string; a: string }[] = [
  {
    q: "Годовая или помесячная подписка — что выгоднее?",
    a: "Годовая подписка у большинства SaaS дешевле в пересчёте на месяц, но списывается разовым крупным платежом. Если планируете пользоваться сервисом дольше 6 месяцев — годовой тариф оправдан; для короткого проекта берите месячный.",
  },
  {
    q: "Что такое VAT и почему сервис берёт его сверху?",
    a: "VAT — налог на добавленную стоимость, который SaaS-компании обязаны начислять для клиентов из ЕС и ряда других юрисдикций. Ставка зависит от страны billing-адреса карты; на итоговую сумму VAT прибавляется к стоимости подписки.",
  },
  {
    q: "Нужен ли бизнес-аккаунт для оплаты корпоративной картой?",
    a: "Для команд SaaS-сервисы предлагают бизнес-аккаунты с общим биллингом и ролями. Оплата с корпоративной карты идёт через один аккаунт-владелец, а участники команды получают доступ по приглашению. VAT-номер компании при наличии снижает или обнуляет налог.",
  },
  {
    q: "Как избежать прерывания доступа к рабочему сервису?",
    a: "Держите на карте запас на несколько будущих списаний и включите автопродление. Если карта откажет при списании, сервис обычно даёт grace-период 5–7 дней, но часть функций может отключиться сразу.",
  },
  {
    q: "Проходят ли крупные разовые платежи за годовые подписки?",
    a: "Да, но при первом крупном платеже сервис или эмитент карты могут запросить подтверждение через 3-D Secure. Убедитесь, что 3-D Secure активен и телефон, привязанный к карте, доступен.",
  },
];

export const Route = createFileRoute("/work-cards")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "keywords", content: "карта для saas, карта для adobe, карта для figma, карта для github, оплата рабочих сервисов" },
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
            { "@type": "ListItem", position: 2, name: "Карты для SaaS", item: URL_ },
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
  component: WorkCardsPage,
});

function WorkCardsPage() {
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
              <span className="text-foreground">Карты для SaaS</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">Подборка · Работа</div>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Карты для оплаты SaaS и рабочих сервисов в 2026 году
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Adobe, Figma, Notion, GitHub, JetBrains и другие рабочие сервисы списывают подписку регулярно, а
              годовые тарифы — разовыми крупными платежами с VAT сверху. Ниже — иностранные виртуальные карты,
              которые проходят на SaaS-платформах и подходят для бизнес-аккаунтов.
            </p>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Топ-5 карт для SaaS</h2>
              <Link to="/" hash="rating" className="shrink-0 text-sm font-semibold text-accent hover:underline">
                Весь рейтинг →
              </Link>
            </div>
          </div>
          <RatingSection cards={top} />
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Как выбрать карту под рабочие подписки</h2>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Стабильные автосписания</div>
                <p className="mt-2 text-sm text-muted-foreground">Прерывание доступа к Figma или GitHub посреди рабочего дня дороже комиссии карты. Приоритет — карты с ровной историей рекуррентных платежей.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Годовой тариф и лимит</div>
                <p className="mt-2 text-sm text-muted-foreground">Годовая подписка списывается одной крупной суммой — держите лимит карты выше стоимости подписки с учётом VAT.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">VAT и billing-адрес</div>
                <p className="mt-2 text-sm text-muted-foreground">VAT зависит от страны billing-адреса карты. У карт в рейтинге адрес корректен и совпадает с BIN — сервис применяет соответствующую ставку.</p>
              </li>
              <li className="rounded-lg border border-border bg-background p-5 shadow-sm">
                <div className="font-serif text-lg font-semibold text-primary">Бизнес-аккаунт</div>
                <p className="mt-2 text-sm text-muted-foreground">Для команд удобнее оформить бизнес-аккаунт с одним биллингом и добавлять участников по приглашению — карта нужна только у владельца аккаунта.</p>
              </li>
            </ul>
          </div>
        </section>

        {services.length > 0 && (
          <section className="border-b border-border bg-background">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Рабочие сервисы</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to="/service/$slug"
                    params={{ slug: s.slug }}
                    className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">Работа</div>
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
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">Частые вопросы про карты для SaaS</h2>
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
