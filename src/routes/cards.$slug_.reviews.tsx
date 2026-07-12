import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { ReviewsSection } from "@/components/nhcard/Reviews";
import { cardBySlugQueryOptions } from "@/lib/cards";
import { CardLogo } from "@/components/nhcard/CardLogo";
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_ROBOTS } from "@/lib/config";

export const Route = createFileRoute("/cards/$slug_/reviews")({
  head: ({ loaderData }) => {
    const data = loaderData as { name?: string; slug?: string } | undefined;
    const name = data?.name ?? "Карта";
    const slug = data?.slug ?? "";
    const url = `https://erapay.ru/cards/${slug}/reviews`;
    const title = `${name} — отзывы пользователей 2026 | EraPay`;
    const description = `Отзывы пользователей о карте ${name}: реальный опыт, оценки, комментарии. Оставьте свой отзыв — EraPay.`;
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
    const card = await context.queryClient.ensureQueryData(cardBySlugQueryOptions(params.slug));
    if (!card) throw notFound();
    return { name: card.name, slug: card.slug };
  },
  component: CardReviewsPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Карта не найдена</h1>
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

function CardReviewsPage() {
  const { slug } = Route.useParams();
  const { data: card } = useSuspenseQuery(cardBySlugQueryOptions(slug));

  // Real (non-demo) published reviews only — for AggregateRating.
  const { data: realAgg } = useSuspenseQuery({
    queryKey: ["reviews_agg_real", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("rating")
        .eq("card_slug", slug)
        .eq("status", "published")
        .eq("is_demo", false);
      if (error) throw error;
      const rows = data ?? [];
      if (rows.length === 0) return { avg: 0, count: 0 };
      const sum = rows.reduce((s, r) => s + r.rating, 0);
      return { avg: sum / rows.length, count: rows.length };
    },
  });

  if (!card) return null;

  const url = `https://erapay.ru/cards/${card.slug}/reviews`;
  const cardUrl = `https://erapay.ru/cards/${card.slug}`;

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
      { "@type": "ListItem", position: 2, name: card.name, item: cardUrl },
      { "@type": "ListItem", position: 3, name: "Отзывы", item: url },
    ],
  };

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: card.name,
    url: cardUrl,
  };
  if (realAgg.count > 0) {
    productLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: realAgg.avg.toFixed(2),
      reviewCount: realAgg.count,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {realAgg.count > 0 && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
        />
      )}

      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Главная</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <Link to="/cards/$slug" params={{ slug: card.slug }} className="hover:text-primary">
                {card.name}
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">Отзывы</span>
            </nav>

            <div className="flex items-start gap-5">
              <CardLogo
                name={card.name}
                logoUrl={card.logo_url}
                logoDomain={card.logo_domain}
                size={56}
                plateClassName="rounded-lg border border-border bg-background text-primary"
              />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                  Редакционная оценка · {Number(card.editorial_score).toFixed(1)}/10
                </div>
                <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                  {card.name} — отзывы пользователей
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Реальный опыт держателей карты. Отзывы с пометкой «образец» — демонстрационные и не учитываются в средней оценке.
                </p>
                <div className="mt-4">
                  <Link
                    to="/cards/$slug"
                    params={{ slug: card.slug }}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-accent hover:underline"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" /> К обзору карты
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ReviewsSection cardSlug={card.slug} cardName={card.name} />
      </main>
      <SiteFooter />
    </div>
  );
}