import { Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { BlogCover } from "@/components/nhcard/BlogCover";

type BlogTeaserPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author_name: string;
  cover_emoji: string;
  published_at: string;
};

export const homeBlogTeaserQueryOptions = queryOptions({
  queryKey: ["blog_posts", "teaser"],
  queryFn: async (): Promise<BlogTeaserPost[]> => {
    const { data, error } = await supabase
      .from("blog_posts" as never)
      .select("id,slug,title,excerpt,category,author_name,cover_emoji,published_at")
      .eq("published", true)
      .order("published_at", { ascending: false })
      .limit(3);
    if (error) throw error;
    return (data as BlogTeaserPost[] | null) ?? [];
  },
});

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

export function BlogTeaserSection() {
  const { data: posts } = useSuspenseQuery(homeBlogTeaserQueryOptions);
  if (posts.length === 0) return null;

  return (
    <section id="blog" className="scroll-mt-20 border-b border-border bg-background">
      <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              Блог
            </div>
            <h2 className="mt-3 max-w-3xl font-serif text-3xl font-bold tracking-tight text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
              Последние статьи блога
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            Все статьи <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <li key={p.id}>
              <Link
                to="/blog/$slug"
                params={{ slug: p.slug }}
                className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm transition-all hover:border-accent/40 hover:shadow-md motion-safe:hover:-translate-y-0.5"
              >
                <BlogCover title={p.title} category={p.category} emoji={p.cover_emoji} size="md" />
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl font-bold leading-snug text-primary">
                    {p.title}
                  </h3>
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
      </div>
    </section>
  );
}