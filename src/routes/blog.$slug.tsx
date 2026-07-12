import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_ROBOTS } from "@/lib/config";
import { sanitizeHtml } from "@/lib/sanitize";

type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  meta_title: string;
  meta_description: string;
  keyword: string;
  author_name: string;
  cover_emoji: string;
  published: boolean;
  published_at: string;
};

const postBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["blog_posts", "slug", slug],
    queryFn: async (): Promise<BlogPost | null> => {
      const { data, error } = await supabase
        .from("blog_posts" as never)
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as BlogPost | null) ?? null;
    },
  });

const otherPostsQueryOptions = queryOptions({
  queryKey: ["blog_posts", "others"],
  queryFn: async (): Promise<BlogPost[]> => {
    const { data, error } = await supabase
      .from("blog_posts" as never)
      .select("id,slug,title,excerpt,category,author_name,cover_emoji,published_at,content,meta_title,meta_description,keyword,published")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(8);
    if (error) throw error;
    return (data as BlogPost[] | null) ?? [];
  },
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export const Route = createFileRoute("/blog/$slug")({
  head: ({ loaderData, params }) => {
    const p = loaderData as { post?: BlogPost } | undefined;
    if (!p?.post) {
      return {
        meta: [{ title: "Статья не найдена · EraPay" }, { name: "robots", content: "noindex" }],
      };
    }
    const post = p.post;
    const url = `https://erapay.ru/blog/${params.slug}`;
    return {
      meta: [
        { title: post.meta_title || `${post.title} · Блог EraPay` },
        { name: "description", content: post.meta_description || post.excerpt },
        { name: "keywords", content: post.keyword },
        { property: "og:title", content: post.meta_title || post.title },
        { property: "og:description", content: post.meta_description || post.excerpt },
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
            "@type": "Article",
            headline: post.title,
            description: post.meta_description || post.excerpt,
            author: { "@type": "Person", name: post.author_name },
            datePublished: post.published_at,
            mainEntityOfPage: url,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
              { "@type": "ListItem", position: 2, name: "Блог", item: "https://erapay.ru/blog" },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postBySlugQueryOptions(params.slug));
    if (!post) throw notFound();
    await context.queryClient.ensureQueryData(otherPostsQueryOptions);
    return { post };
  },
  component: BlogArticlePage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Статья не найдена</h1>
        <p className="mt-3 text-muted-foreground">
          Такой статьи в блоге EraPay пока нет.
        </p>
        <Link
          to="/blog"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground"
        >
          В блог
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
});

function BlogArticlePage() {
  const { slug } = Route.useParams();
  const { data: post } = useSuspenseQuery(postBySlugQueryOptions(slug));
  const { data: others } = useSuspenseQuery(otherPostsQueryOptions);

  if (!post) return null;

  const related = others.filter((p) => p.slug !== post.slug).slice(0, 3);

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
              <Link to="/blog" className="hover:text-primary">
                Блог
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">{post.title}</span>
            </nav>

            <div className="text-5xl" aria-hidden>
              {post.cover_emoji}
            </div>
            {post.category && (
              <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-accent">
                {post.category}
              </div>
            )}
            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {post.title}
            </h1>
            <p className="mt-4 text-sm text-muted-foreground">
              {post.author_name} · {formatDate(post.published_at)}
            </p>
          </div>
        </section>

        <section className="bg-background">
          <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:px-8">
            <article
              className="blog-content text-base leading-relaxed text-foreground/90"
              dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
            />

            <div className="mt-12 rounded-xl border border-border bg-surface p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                Выбрать карту
              </div>
              <h3 className="mt-1 font-serif text-xl font-bold text-primary">
                Рейтинг зарубежных виртуальных карт EraPay
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Сравните карты по стоимости, лимитам и приёму — и выберите под свой сценарий.
              </p>
              <Link
                to="/"
                hash="rating"
                className="mt-4 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                К рейтингу карт →
              </Link>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-border bg-surface">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Читайте также
              </h2>
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="flex h-full flex-col rounded-xl border border-border bg-background p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="text-3xl" aria-hidden>
                        {p.cover_emoji}
                      </div>
                      <h3 className="mt-3 font-serif text-lg font-bold leading-snug text-primary">
                        {p.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {p.excerpt}
                      </p>
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