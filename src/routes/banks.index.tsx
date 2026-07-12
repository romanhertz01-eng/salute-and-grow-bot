import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";

type BankPage = {
  id: string;
  slug: string;
  title: string;
  h1: string;
  intro_text: string;
  priority: number;
};

const banksListQueryOptions = queryOptions({
  queryKey: ["bank_pages", "list"],
  queryFn: async (): Promise<BankPage[]> => {
    const { data, error } = await supabase
      .from("bank_pages")
      .select("id,slug,title,h1,intro_text,priority")
      .eq("published", true)
      .order("priority", { ascending: false });
    if (error) throw error;
    return (data as BankPage[] | null) ?? [];
  },
});

export const Route = createFileRoute("/banks/")({
  head: () => ({
    meta: [
      { title: "Банковские карты иностранных банков для россиян — EraPay" },
      {
        name: "description",
        content:
          "Полноценные карты иностранных банков с IBAN для россиян: дебетовые, кредитные, с кэшбэком. Чем отличаются от виртуальных карт-посредников.",
      },
      { property: "og:title", content: "Банковские карты иностранных банков — EraPay" },
      {
        property: "og:description",
        content:
          "Обзор реальных карт иностранных банков для россиян: где открыть, требования, плюсы и минусы.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://erapay.ru/banks" },
    ],
    links: [{ rel: "canonical", href: "https://erapay.ru/banks" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(banksListQueryOptions),
  component: BanksIndexPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Страница не найдена</div>
  ),
});

function BanksIndexPage() {
  const { data: pages } = useSuspenseQuery(banksListQueryOptions);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[960px] px-4 py-14 sm:px-6 lg:px-8">
            <nav
              aria-label="Хлебные крошки"
              className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground"
            >
              <Link to="/" className="hover:text-primary">
                Главная
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">Банковские карты</span>
            </nav>
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              Обзор EraPay
            </div>
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Банковские карты иностранных банков
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/80">
              Это карты, привязанные к реальному счёту с IBAN в банке за пределами России —
              не виртуальные карты-посредники, а полноценный банковский продукт. Ниже разберём,
              для кого это подходит, какие бывают виды и когда проще ограничиться виртуалкой из{" "}
              <Link to="/" hash="rating" className="underline hover:text-primary">
                рейтинга EraPay
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/banks/$slug"
                    params={{ slug: p.slug }}
                    className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                  >
                    <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Банковская карта
                    </div>
                    <h2 className="mt-2 font-serif text-xl font-bold leading-snug text-primary">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {p.intro_text}
                    </p>
                    <span className="mt-auto pt-4 text-sm font-semibold text-accent">
                      Читать обзор →
                    </span>
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