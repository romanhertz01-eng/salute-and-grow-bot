import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TopicArticlePage, type TopicConfig, type TopicPageRow } from "@/components/nhcard/TopicPage";
import { PUBLIC_ROBOTS } from "@/lib/config";

type Row = TopicPageRow & {
  meta_title: string;
  meta_description: string;
  keyword: string;
};

const bySlugQO = (slug: string) =>
  queryOptions({
    queryKey: ["crypto_pages", "slug", slug],
    queryFn: async (): Promise<Row | null> => {
      const { data, error } = await supabase
        .from("crypto_pages" as never)
        .select("id,slug,title,h1,intro_text,content,partner_url,meta_title,meta_description,keyword")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as Row | null) ?? null;
    },
  });

const othersQO = queryOptions({
  queryKey: ["crypto_pages", "others"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("crypto_pages" as never)
      .select("slug,title,intro_text")
      .eq("published", true)
      .order("priority", { ascending: false })
      .limit(6);
    if (error) throw error;
    return (data as { slug: string; title: string; intro_text: string }[] | null) ?? [];
  },
});

const TOPIC_FAQS: Record<string, { q: string; a: string }[]> = {
  obmenniki: [
    { q: "Как понять, что обменник надёжный?", a: "Смотрите на срок работы, отзывы на BestChange и Kurs.expert, наличие юрлица, реальную поддержку. Не переводите большие суммы новым обменникам." },
    { q: "Насколько курс обменника хуже биржевого?", a: "Обычно на 1–3%. Это плата за скорость и простоту — вам не нужно самому искать контрагента, как в P2P." },
    { q: "Что делать, если обменник задерживает выплату?", a: "Сначала — связаться с поддержкой. Если оператор не отвечает несколько часов, оставьте отзыв на мониторинге BestChange и обратитесь в их арбитраж." },
  ],
  "kupit-usdt": [
    { q: "В какой сети покупать USDT?", a: "TRC-20 (Tron) — самая дешёвая и быстрая. ERC-20 (Ethereum) универсальна, но комиссии высокие. Всегда сверяйте сеть с получателем." },
    { q: "Могут ли заблокировать карту после покупки USDT?", a: "Банк может задать вопросы по 115-ФЗ. Не переводите крупные суммы одной операцией и не указывайте назначение «покупка криптовалюты»." },
    { q: "Нужно ли платить налог с покупки USDT?", a: "С покупки — нет. Налог возникает при продаже с прибылью: 13% (15% свыше 5 млн ₽ в год) НДФЛ с разницы." },
  ],
  birzhi: [
    { q: "Какая биржа лучшая для новичка из России?", a: "Bybit — самая удобная в СНГ: русский интерфейс, развитый P2P, невысокие комиссии, работает базовый KYC." },
    { q: "Нужно ли делать KYC?", a: "Для базовых операций и P2P — да. Простая процедура: паспорт и селфи. Без KYC лимиты сильно ограничены." },
    { q: "Безопасно ли хранить крипту на бирже?", a: "Для активной торговли — да. Для долгосрочного хранения крупных сумм лучше вывести на собственный кошелёк, желательно аппаратный." },
  ],
  koshelki: [
    { q: "Горячий или холодный кошелёк — что выбрать?", a: "Мелкие суммы — горячий (Trust Wallet, MetaMask). Крупные накопления — холодный (Ledger, Trezor)." },
    { q: "Что такое seed-фраза и как её хранить?", a: "12 или 24 слова, полностью открывающие доступ к кошельку. Записать на бумагу или металл, положить в сейф. Не хранить в облаке, не фотографировать." },
    { q: "Можно ли восстановить кошелёк без seed-фразы?", a: "Нет. Ни один разработчик не имеет доступа к вашим ключам. Потерянная фраза = потерянные средства." },
  ],
  "p2p-vs-obmennik": [
    { q: "Что быстрее — P2P или обменник?", a: "Обменник обычно 10–30 минут. P2P — от получаса до нескольких часов, зависит от скорости продавца." },
    { q: "Где курс выгоднее?", a: "На P2P курс близок к биржевому. В обменнике — на 1–3% хуже. Разница ощутима от 100 тыс. ₽." },
    { q: "Что безопаснее по банку?", a: "Обменник как юрлицо выглядит для банка привычнее. В P2P вы получаете перевод от постороннего физлица." },
  ],
  "vyvod-v-rubli": [
    { q: "Как избежать блокировки карты по 115-ФЗ?", a: "Не концентрируйте поступления на одной карте, разносите по банкам, сохраняйте историю сделок, будьте готовы объяснить источник средств." },
    { q: "Нужно ли платить налог с крипты?", a: "Да. НДФЛ 13% (15% свыше 5 млн ₽ в год) с разницы между ценой продажи и покупки." },
    { q: "Легально ли вообще выводить крипту в рубли?", a: "Да. Владение и обмен криптовалюты в РФ разрешены. Запрещена только оплата криптой товаров/услуг внутри страны." },
  ],
};

function makeTopic(faqs: { q: string; a: string }[]): TopicConfig {
  return {
    key: "crypto",
    sectionLabel: "Крипта",
    indexPath: "/crypto",
    eyebrow: "Криптовалюта · Экспертиза EraPay",
    faq: faqs,
  };
}

export const Route = createFileRoute("/crypto/$slug")({
  head: ({ loaderData, params }) => {
    const l = loaderData as { page?: Row } | undefined;
    if (!l?.page) {
      return { meta: [{ title: "Страница не найдена · EraPay" }, { name: "robots", content: "noindex" }] };
    }
    const p = l.page;
    const url = `https://erapay.ru/crypto/${params.slug}`;
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
        { name: "robots", content: PUBLIC_ROBOTS },
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
            publisher: {
              "@type": "Organization",
              name: "EraPay",
              logo: { "@type": "ImageObject", url: "https://erapay.ru/apple-touch-icon.png" },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
              { "@type": "ListItem", position: 2, name: "Крипта", item: "https://erapay.ru/crypto" },
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
  component: CryptoArticle,
  notFoundComponent: () => (
    <div className="p-10 text-center text-sm text-muted-foreground">Страница не найдена</div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
});

function CryptoArticle() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery(bySlugQO(slug));
  const { data: others } = useSuspenseQuery(othersQO);
  if (!page) return null;
  const related = others.filter((o) => o.slug !== page.slug).slice(0, 3);
  const topic = makeTopic(TOPIC_FAQS[slug] ?? []);
  return <TopicArticlePage page={page} topic={topic} related={related} />;
}