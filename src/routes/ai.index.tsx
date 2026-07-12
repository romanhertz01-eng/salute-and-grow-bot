import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopicIndexPage, type TopicConfig } from "@/components/nhcard/TopicPage";
import { PUBLIC_ROBOTS } from "@/lib/config";

type Row = { slug: string; title: string; intro_text: string; priority: number };

const listQO = queryOptions({
  queryKey: ["ai_pages", "list"],
  queryFn: async (): Promise<Row[]> => {
    const { data, error } = await supabase
      .from("ai_pages" as never)
      .select("slug,title,intro_text,priority")
      .eq("published", true)
      .order("priority", { ascending: false });
    if (error) throw error;
    return (data as Row[] | null) ?? [];
  },
});

const TOPIC: TopicConfig = {
  key: "ai",
  sectionLabel: "Нейросети",
  indexPath: "/ai",
  eyebrow: "Нейросети · Экспертиза EraPay",
  faq: [],
};

export const Route = createFileRoute("/ai/")({
  head: () => ({
    meta: [
      { title: "Нейросети — генерация текста, изображений, видео · EraPay" },
      {
        name: "description",
        content:
          "Раздел о нейросетях: обзоры ChatGPT, Claude, Midjourney, Sora, Suno и других моделей. Как выбрать под задачу и оплатить из России.",
      },
      { property: "og:title", content: "Нейросети — раздел EraPay" },
      {
        property: "og:description",
        content: "Обзоры лучших нейросетей 2026 года: чат-боты, генерация изображений, видео, музыки, текста.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://erapay.ru/ai" },
      { name: "robots", content: PUBLIC_ROBOTS },
    ],
    links: [{ rel: "canonical", href: "https://erapay.ru/ai" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listQO),
  component: AiIndex,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Страница не найдена</div>
  ),
});

function AiIndex() {
  const { data } = useSuspenseQuery(listQO);
  return (
    <TopicIndexPage
      topic={TOPIC}
      intro="Нейросети — самая быстро развивающаяся область технологий. Мы разбираем лучшие модели 2026 года по задачам: чат, генерация изображений, видео, музыки и текста. Без хайпа, с фокусом на практический выбор."
      pages={data}
    />
  );
}