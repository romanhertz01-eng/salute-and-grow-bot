import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { BlogCover } from "@/components/nhcard/BlogCover";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author_name: string;
  cover_emoji: string;
  published_at: string;
};

const blogListQueryOptions = queryOptions({
  queryKey: ["blog_posts", "list"],
  queryFn: async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from("blog_posts" as never)
      .select("id,slug,title,excerpt,category,author_name,cover_emoji,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as BlogPost[] | null) ?? [];
  },
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Блог EraPay — статьи о зарубежных виртуальных картах" },
      {
        name: "description",
        content:
          "Экспертные статьи EraPay о зарубежных виртуальных картах: BIN, KYC, 3-D Secure, пополнение через СБП, налоги, безопасность и многое другое.",
      },
      { property: "og:title", content: "Блог EraPay — статьи о зарубежных виртуальных картах" },
      {
        property: "og:description",
        content:
          "Экспертные статьи о зарубежных виртуальных картах: как выбрать, пополнить и безопасно использовать.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://erapay.ru/blog" },
    ],
    links: [{ rel: "canonical", href: "https://erapay.ru/blog" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(blogListQueryOptions),
  component: BlogListPage,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Страница не найдена</div>
  ),
});

function BlogListPage() {
  const { data: posts } = useSuspenseQuery(blogListQueryOptions);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-14 sm:px-6 lg:px-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              Блог · Экспертиза EraPay
            </div>
            <h1 className="mt-2 font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              Блог EraPay
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Как устроены зарубежные виртуальные карты, как их выбирать и безопасно
              использовать — без магии, обещаний и обхода санкций. Только реальная бытовая
              информация.
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <li key={p.id}>
                   <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:border-accent/40 hover:shadow-md motion-safe:hover:-translate-y-0.5"
                  >
                    <BlogCover title={p.title} category={p.category} emoji={p.cover_emoji} size="md" />
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="font-serif text-xl font-bold leading-snug text-primary">
                        {p.title}
                      </h2>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                        {p.excerpt}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                        <span>{p.author_name}</span>
                        <span>{formatDate(p.published_at)}</span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {posts.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Статей пока нет.
              </div>
            )}
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}