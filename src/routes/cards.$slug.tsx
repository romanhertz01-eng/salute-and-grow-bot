import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { cardBySlugQueryOptions, formatDate, initials } from "@/lib/cards";

export const Route = createFileRoute("/cards/$slug")({
  head: ({ loaderData }) => {
    const name = (loaderData as { name?: string } | undefined)?.name ?? "Карта";
    return {
      meta: [
        { title: `${name} — обзор и тарифы · EraPay` },
        { name: "description", content: `Условия, лимиты и способы пополнения карты ${name}. Проверено редакцией EraPay.` },
      ],
    };
  },
  loader: async ({ context, params }) => {
    const card = await context.queryClient.ensureQueryData(cardBySlugQueryOptions(params.slug));
    if (!card) throw notFound();
    return { name: card.name };
  },
  component: CardPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Карта не найдена</h1>
        <p className="mt-3 text-muted-foreground">Проверьте адрес или вернитесь к рейтингу.</p>
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

function CardPage() {
  const { slug } = Route.useParams();
  const { data: card } = useSuspenseQuery(cardBySlugQueryOptions(slug));
  if (!card) return null;

  const rows: [string, string | null][] = [
    ["Страна выпуска", card.issuer_country],
    ["Банк-эмитент", card.bank],
    ["Платёжная система", card.payment_system],
    ["Стоимость выпуска", card.issue_cost],
    ["Обслуживание", card.service_cost],
    ["Комиссия пополнения", card.topup_fee],
    ["Способы пополнения", (card.topup_methods ?? []).join(", ") || null],
    ["Валюты карты", (card.card_currency ?? []).join(", ") || null],
    ["Лимит в месяц", card.monthly_limit],
    ["Скорость выпуска", card.issue_speed],
    ["KYC", card.kyc ? "требуется" : "не требуется"],
    ["Apple Pay", card.apple_pay ? "поддерживается" : "нет"],
    ["Google Pay", card.google_pay ? "поддерживается" : "нет"],
    ["BIN страны", card.bin_country],
    ["Поддерживаемых сервисов", String(card.supported_services_count ?? 0)],
  ];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> К рейтингу
            </Link>

            <div className="flex flex-wrap items-start gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-border bg-background font-serif text-xl font-bold text-primary">
                {initials(card.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Место в рейтинге · #{card.rank}
                </div>
                <h1 className="mt-1 font-serif text-4xl font-bold tracking-tight text-primary">{card.name}</h1>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <span>{card.payment_system}</span>
                  <span aria-hidden>·</span>
                  <span>{card.bank}</span>
                  <span aria-hidden>·</span>
                  <span>{card.issuer_country}</span>
                  {card.verified && (
                    <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                      <ShieldCheck className="h-3 w-3" /> Проверено
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif text-4xl font-bold text-primary">
                  {Number(card.editorial_score).toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">{card.reviews_count} отзывов</div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={card.affiliate_url ?? "#"}
                target="_blank"
                rel="nofollow sponsored noopener"
                className="inline-flex h-11 items-center rounded-md bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-sm hover:bg-accent/90"
              >
                Оформить на сайте эмитента
              </a>
              <span className="inline-flex h-11 items-center rounded-md border border-border bg-background px-4 text-xs text-muted-foreground">
                Проверено {formatDate(card.last_checked)}
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
          <h2 className="font-serif text-2xl font-bold text-primary">Тарифы и условия</h2>
          <div className="mt-6 overflow-hidden rounded-lg border border-border bg-background shadow-sm">
            <dl className="divide-y divide-border">
              {rows.map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 gap-1 px-5 py-3 sm:grid-cols-[240px_1fr] sm:gap-6">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium text-foreground">{value ?? "—"}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            EraPay не является эмитентом карты. Условия могут меняться — проверяйте информацию на сайте эмитента.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}