import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { PUBLIC_ROBOTS } from "@/lib/config";

export const Route = createFileRoute("/network/")({
  head: () => {
    const url = "https://erapay.ru/network";
    const title = "Платёжные системы: Visa и Mastercard для россиян · EraPay";
    const description =
      "Виртуальные карты Visa и Mastercard из России в 2026 году: сравнение платёжных систем, топ карт и рекомендации редакции EraPay.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { name: "robots", content: PUBLIC_ROBOTS },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: NetworkIndex,
});

function NetworkIndex() {
  const items = [
    {
      slug: "visa",
      name: "Visa",
      teaser: "Крупнейшая мировая платёжная система — расчёт через USD.",
    },
    {
      slug: "mastercard",
      name: "Mastercard",
      teaser: "Вторая мировая система — расчёт часто через EUR, удобно в Европе.",
    },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <nav aria-label="Хлебные крошки" className="mb-6 flex items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Главная</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">Платёжные системы</span>
            </nav>
            <h1 className="font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Платёжные системы для виртуальных карт
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground/85">
              Для российских пользователей в 2026 году доступны карты двух мировых платёжных систем — Visa и Mastercard.
              Выбор системы влияет на валюту расчёта, комиссии и удобство оплаты в разных регионах.
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-[1040px] px-4 py-14 sm:px-6 lg:px-8">
            <ul className="grid gap-4 sm:grid-cols-2">
              {items.map((it) => (
                <li key={it.slug}>
                  <Link
                    to="/network/$slug"
                    params={{ slug: it.slug }}
                    className="block rounded-xl border border-border bg-background p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">Платёжная система</div>
                    <div className="mt-1 font-serif text-3xl font-bold text-primary">{it.name}</div>
                    <p className="mt-2 text-sm text-muted-foreground">{it.teaser}</p>
                    <div className="mt-4 text-sm font-semibold text-accent">Подробнее →</div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}