import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopicArticlePage, type TopicConfig, type TopicPageRow } from "@/components/nhcard/TopicPage";

type Row = TopicPageRow & {
  meta_title: string;
  meta_description: string;
  keyword: string;
};

const bySlugQO = (slug: string) =>
  queryOptions({
    queryKey: ["ai_pages", "slug", slug],
    queryFn: async (): Promise<Row | null> => {
      const { data, error } = await supabase
        .from("ai_pages" as never)
        .select("id,slug,title,h1,intro_text,content,partner_url,meta_title,meta_description,keyword")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as Row | null) ?? null;
    },
  });

const othersQO = queryOptions({
  queryKey: ["ai_pages", "others"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("ai_pages" as never)
      .select("slug,title,intro_text")
      .eq("published", true)
      .order("priority", { ascending: false })
      .limit(6);
    if (error) throw error;
    return (data as { slug: string; title: string; intro_text: string }[] | null) ?? [];
  },
});

const TOPIC_FAQS: Record<string, { q: string; a: string }[]> = {
  agregatory: [
    { q: "Зачем нужен агрегатор, если есть ChatGPT?", a: "Ни одна модель не лучшая во всём: у Claude сильный код, у Gemini огромный контекст, у Grok свежие новости. Агрегатор даёт доступ ко всем сразу и оплачивается рублями." },
    { q: "Уступают ли агрегаторы прямым подпискам?", a: "Иногда — в редких premium-функциях. Для 95% задач разницы нет, а цена в 3–5 раз ниже." },
    { q: "Как оплатить агрегатор из России?", a: "Российские агрегаторы принимают карты «Мир», СБП и криптовалюту. Не нужны зарубежные карты и VPN." },
  ],
  "generatsiya-izobrazheniy": [
    { q: "Какая модель лучшая в 2026 году?", a: "Зависит от задачи: Midjourney для художественной эстетики, FLUX для фотореализма, Ideogram для текста в картинке, DALL-E для быстрых иллюстраций." },
    { q: "Можно ли использовать ИИ-изображения в коммерции?", a: "Да, если тариф сервиса это разрешает. У Midjourney и DALL-E коммерческое использование включено в платные тарифы." },
    { q: "Как получить фотореализм?", a: "Лучшие результаты сегодня даёт FLUX и Midjourney v7 в фотореалистичном режиме. Важен подробный промпт с описанием света, оптики и композиции." },
  ],
  "generatsiya-video": [
    { q: "Какое максимальное качество даёт ИИ-видео?", a: "Sora и Veo 3 генерируют видео вплоть до 1080p с реалистичной физикой. Ограничение — длина: сцены обычно до 10–20 секунд." },
    { q: "Можно ли делать длинные ролики?", a: "Прямо из ИИ — нет. Нужно склеивать несколько сцен, что делают Runway и профессиональные редакторы." },
    { q: "Что дешевле — Sora или Kling?", a: "Kling заметно дешевле при сопоставимом качестве. Для регулярной работы Kling часто выгоднее." },
  ],
  "generatsiya-teksta": [
    { q: "GPT или Claude — что выбрать?", a: "GPT — универсальный ассистент с сильной мультимодальностью и голосом. Claude — точнее в коде, длинных документах и следовании инструкциям." },
    { q: "Что такое контекст модели?", a: "Объём текста, который модель «помнит» в одном диалоге. У Gemini до 2 млн токенов — это книга среднего размера." },
    { q: "Насколько надёжны ответы?", a: "Даже топовые модели иногда «галлюцинируют» — выдумывают факты. Для критичных задач сверяйте ключевые утверждения с источниками." },
  ],
  "generatsiya-muzyki": [
    { q: "Какой сервис лучший для музыки с вокалом?", a: "Suno v4 — лидер по вокалу и универсальности жанров. Udio часто побеждает в «студийных» стилях." },
    { q: "Можно ли выкладывать ИИ-треки на Spotify?", a: "Зависит от тарифа сервиса и правил площадки. Коммерческие права даёт только платная подписка. Читайте пользовательское соглашение." },
    { q: "Сколько занимает генерация трека?", a: "Обычно 30–60 секунд на трек длиной 2–3 минуты. Можно продлевать треки и переделывать отдельные секции." },
  ],
  "chat-boty": [
    { q: "Какой чат-бот лучший в 2026 году?", a: "Для универсальной помощи — ChatGPT. Для программирования — Claude. Для работы в Google — Gemini. Для Office — Microsoft Copilot." },
    { q: "Есть ли российские альтернативы?", a: "YandexGPT и GigaChat. Уступают западным моделям в общем качестве, но оплачиваются рублями и хорошо работают с русскими реалиями." },
    { q: "Можно ли использовать чат-боты бесплатно?", a: "У всех крупных сервисов есть бесплатные тарифы с лимитами. Для регулярной работы платная подписка окупается быстро." },
  ],
};

function makeTopic(faqs: { q: string; a: string }[]): TopicConfig {
  return {
    key: "ai",
    sectionLabel: "Нейросети",
    indexPath: "/ai",
    eyebrow: "Нейросети · Экспертиза EraPay",
    faq: faqs,
  };
}

export const Route = createFileRoute("/ai/$slug")({
  head: ({ loaderData, params }) => {
    const l = loaderData as { page?: Row } | undefined;
    if (!l?.page) {
      return { meta: [{ title: "Страница не найдена · EraPay" }, { name: "robots", content: "noindex" }] };
    }
    const p = l.page;
    const url = `https://erapay.ru/ai/${params.slug}`;
    const faqs = TOPIC_FAQS[params.slug] ?? [];
    return {
      meta: [
        { title: p.meta_title || `${p.title} · EraPay` },
        { name: "description", content: p.meta_description || p.intro_text },
        { name: "keywords", content: p.keyword },
        { property: "og:title", content: p.meta_title || p.title },
        { property: "og:description", content: p.meta_description || p.intro_text },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "robots", content: "index, follow" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: p.title,
            description: p.meta_description || p.intro_text,
            mainEntityOfPage: url,
            author: { "@type": "Organization", name: "EraPay" },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
              { "@type": "ListItem", position: 2, name: "Нейросети", item: "https://erapay.ru/ai" },
              { "@type": "ListItem", position: 3, name: p.title, item: url },
            ],
          }),
        },
        ...(faqs.length
          ? [
              {
                type: "application/ld+json",
                children: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: faqs.map((f) => ({
                    "@type": "Question",
                    name: f.q,
                    acceptedAnswer: { "@type": "Answer", text: f.a },
                  })),
                }),
              },
            ]
          : []),
      ],
    };
  },
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(bySlugQO(params.slug));
    if (!page) throw notFound();
    await context.queryClient.ensureQueryData(othersQO);
    return { page };
  },
  component: AiArticle,
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Страница не найдена</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
});

function AiArticle() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery(bySlugQO(slug));
  const { data: others } = useSuspenseQuery(othersQO);
  if (!page) return null;
  const related = others.filter((o) => o.slug !== page.slug).slice(0, 3);
  const topic = makeTopic(TOPIC_FAQS[slug] ?? []);
  return <TopicArticlePage page={page} topic={topic} related={related} />;
}