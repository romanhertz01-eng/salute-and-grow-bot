import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense } from "react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { Hero } from "@/components/nhcard/Hero";
import { RatingSection } from "@/components/nhcard/Rating";
import { TrustSection } from "@/components/nhcard/Trust";
import { TasksSection } from "@/components/nhcard/Tasks";
import { CountriesSection } from "@/components/nhcard/Countries";
import { CalculatorSection } from "@/components/nhcard/Calculator";
import { MethodologySection } from "@/components/nhcard/Methodology";
import { FaqSection, FAQ_ITEMS } from "@/components/nhcard/Faq";
import { cardsQueryOptions } from "@/lib/cards";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EraPay — независимый рейтинг зарубежных виртуальных карт 2026" },
      {
        name: "description",
        content:
          "Сравнение 15 зарубежных виртуальных карт для россиян: тарифы, лимиты, способы пополнения. Проверено редакцией.",
      },
      { property: "og:title", content: "EraPay — независимый рейтинг зарубежных виртуальных карт 2026" },
      {
        property: "og:description",
        content: "Сравнение 15 зарубежных виртуальных карт для россиян: тарифы, лимиты, способы пополнения. Проверено редакцией.",
      },
      { property: "og:url", content: "https://erapay.ru/" },
      { property: "og:type", content: "website" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://erapay.ru/" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ_ITEMS.map((it) => ({
            "@type": "Question",
            name: it.q,
            acceptedAnswer: { "@type": "Answer", text: it.a },
          })),
        }),
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(cardsQueryOptions),
  component: HomePage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Не удалось загрузить рейтинг: {error.message}</div>
  ),
});

function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Suspense fallback={<div className="p-10 text-center text-sm text-muted-foreground">Загрузка…</div>}>
          <HomeContent />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

function HomeContent() {
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
  return (
    <>
      <Hero total={cards.length} />
      <RatingSection cards={cards} />
      <TasksSection />
      <CountriesSection cards={cards} />
      <TrustSection />
      <CalculatorSection cards={cards} />
      <MethodologySection />
      <FaqSection />
    </>
  );
}