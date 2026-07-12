import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopicIndexPage, type TopicConfig } from "@/components/nhcard/TopicPage";
import { PUBLIC_ROBOTS } from "@/lib/config";

type Row = { slug: string; title: string; intro_text: string; priority: number };

const listQO = queryOptions({
  queryKey: ["crypto_pages", "list"],
  queryFn: async (): Promise<Row[]> => {
    const { data, error } = await supabase
      .from("crypto_pages" as never)
      .select("slug,title,intro_text,priority")
      .eq("published", true)
      .order("priority", { ascending: false });
    if (error) throw error;
    return (data as Row[] | null) ?? [];
  },
});

const TOPIC: TopicConfig = {
  key: "crypto",
  sectionLabel: "Крипта",
  indexPath: "/crypto",
  eyebrow: "Криптовалюта · Экспертиза EraPay",
  faq: [],
};

export const Route = createFileRoute("/crypto/")({
  head: () => ({
    meta: [
      { title: "Криптовалюта — обменники, биржи, кошельки · EraPay" },
      {
        name: "description",
        content:
          "Раздел о криптовалюте: как выбрать обменник, где купить USDT за рубли, лучшие биржи и кошельки, вывод в рубли. Обзоры EraPay.",
      },
      { property: "og:title", content: "Криптовалюта — раздел EraPay" },
      {
        property: "og:description",
        content: "Обзоры обменников, бирж, кошельков и способов покупки криптовалюты за рубли.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://erapay.ru/crypto" },
      { name: "robots", content: PUBLIC_ROBOTS },
    ],
    links: [{ rel: "canonical", href: "https://erapay.ru/crypto" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(listQO),
  component: CryptoIndex,
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Страница не найдена</div>
  ),
});

function CryptoIndex() {
  const { data } = useSuspenseQuery(listQO);
  return (
    <TopicIndexPage
      topic={TOPIC}
      intro="Криптовалюта — легальный способ хранить и переводить деньги, если разбираться в инструментах. Мы собрали разборы обменников, бирж, кошельков и способов покупки USDT за рубли — без обещаний «лёгких денег» и без схем обхода закона."
      pages={data}
    />
  );
}