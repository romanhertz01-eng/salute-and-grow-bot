import { Link } from "@tanstack/react-router";
import { ChevronRight, ExternalLink } from "lucide-react";
import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";

export type TopicPageRow = {
  id: string;
  slug: string;
  title: string;
  h1: string;
  intro_text: string;
  content: string;
  partner_url: string;
};

export type TopicConfig = {
  key: "crypto" | "ai";
  sectionLabel: string; // "Крипта" / "Нейросети"
  indexPath: "/crypto" | "/ai";
  eyebrow: string;
  faq: { q: string; a: string }[];
};

export function TopicArticlePage({
  page,
  topic,
  related,
}: {
  page: TopicPageRow;
  topic: TopicConfig;
  related: { slug: string; title: string; intro_text: string }[];
}) {
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
              {topic.key === "crypto" ? (
                <Link to="/crypto" className="hover:text-primary">
                  {topic.sectionLabel}
                </Link>
              ) : (
                <Link to="/ai" className="hover:text-primary">
                  {topic.sectionLabel}
                </Link>
              )}
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">{page.title}</span>
            </nav>

            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              {topic.eyebrow}
            </div>
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {page.h1}
            </h1>
            {page.intro_text && (
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                {page.intro_text}
              </p>
            )}
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:px-8">
            <article
              className="blog-content text-base leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />

            <div className="mt-10 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                Партнёр раздела
              </div>
              <h3 className="mt-1 font-serif text-xl font-bold text-primary">
                {topic.key === "crypto" ? "Проверенный обменник и P2P-сервис" : "Доступ к нейросетям по подписке"}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {topic.key === "crypto"
                  ? "Партнёр раздела — сервис для покупки, продажи и обмена криптовалюты. Условия сотрудничества — на странице «Раскрытие партнёрских ссылок»."
                  : "Партнёр раздела — платформа с доступом ко всем ведущим нейросетям через одну подписку. Условия — на странице «Раскрытие партнёрских ссылок»."}
              </p>
              {page.partner_url ? (
                <a
                  href={page.partner_url}
                  rel="sponsored nofollow noopener"
                  target="_blank"
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  Перейти к партнёру
                  <ExternalLink className="h-4 w-4" aria-hidden />
                </a>
              ) : (
                <button
                  type="button"
                  disabled
                  className="mt-4 inline-flex h-10 cursor-not-allowed items-center rounded-md bg-muted px-4 text-sm font-semibold text-muted-foreground opacity-70"
                  aria-disabled
                >
                  Ссылка скоро появится
                </button>
              )}
            </div>

            <div className="mt-12">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Часто задаваемые вопросы
              </h2>
              <div className="mt-6 space-y-4">
                {topic.faq.map((f) => (
                  <details
                    key={f.q}
                    className="group rounded-lg border border-border bg-surface p-5"
                  >
                    <summary className="cursor-pointer list-none font-medium text-primary">
                      {f.q}
                    </summary>
                    <p className="mt-3 text-[15px] leading-relaxed text-foreground/85">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-border bg-surface">
            <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Читайте также
              </h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <li key={p.slug}>
                    {topic.key === "crypto" ? (
                      <Link
                        to="/crypto/$slug"
                        params={{ slug: p.slug }}
                        className="flex h-full flex-col rounded-xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                      >
                        <h3 className="font-serif text-lg font-bold leading-snug text-primary">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {p.intro_text.slice(0, 140)}…
                        </p>
                      </Link>
                    ) : (
                      <Link
                        to="/ai/$slug"
                        params={{ slug: p.slug }}
                        className="flex h-full flex-col rounded-xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                      >
                        <h3 className="font-serif text-lg font-bold leading-snug text-primary">
                          {p.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                          {p.intro_text.slice(0, 140)}…
                        </p>
                      </Link>
                    )}
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

export function TopicIndexPage({
  topic,
  intro,
  pages,
}: {
  topic: TopicConfig;
  intro: string;
  pages: { slug: string; title: string; intro_text: string }[];
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1120px] px-4 py-14 sm:px-6 lg:px-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              {topic.eyebrow}
            </div>
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {topic.sectionLabel}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {intro}
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-[1120px] px-4 py-12 sm:px-6 lg:px-8">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {pages.map((p) => (
                <li key={p.slug}>
                  {topic.key === "crypto" ? (
                    <Link
                      to="/crypto/$slug"
                      params={{ slug: p.slug }}
                      className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <h2 className="font-serif text-lg font-bold leading-snug text-primary">
                        {p.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.intro_text}
                      </p>
                      <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">
                        Читать →
                      </div>
                    </Link>
                  ) : (
                    <Link
                      to="/ai/$slug"
                      params={{ slug: p.slug }}
                      className="flex h-full flex-col rounded-xl border border-border bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <h2 className="font-serif text-lg font-bold leading-snug text-primary">
                        {p.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.intro_text}
                      </p>
                      <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">
                        Читать →
                      </div>
                    </Link>
                  )}
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