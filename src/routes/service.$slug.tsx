import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";

import { SiteHeader } from "@/components/nhcard/Header";
import { SiteFooter } from "@/components/nhcard/Footer";
import { RatingSection } from "@/components/nhcard/Rating";
import { supabase } from "@/integrations/supabase/client";
import { cardsQueryOptions } from "@/lib/cards";
import { PUBLIC_ROBOTS } from "@/lib/config";

type ServicePage = {
  id: string;
  slug: string;
  name: string;
  category: string;
  h1: string;
  meta_title: string;
  meta_description: string;
  intro_text: string | null;
  keyword: string;
  priority: number;
  published: boolean;
};

const servicePageBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["service_pages", slug],
    queryFn: async (): Promise<ServicePage | null> => {
      const { data, error } = await supabase
        .from("service_pages" as never)
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      if (error) throw error;
      return (data as ServicePage | null) ?? null;
    },
  });

const servicePagesByCategoryQueryOptions = (category: string) =>
  queryOptions({
    queryKey: ["service_pages", "category", category],
    queryFn: async (): Promise<ServicePage[]> => {
      const { data, error } = await supabase
        .from("service_pages" as never)
        .select("*")
        .eq("category", category)
        .eq("published", true);
      if (error) throw error;
      return (data as ServicePage[] | null) ?? [];
    },
  });

// Detert. hash: pick a stable variant per slug so each page differs but stays deterministic.
function slugHash(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h;
}
function pick<T>(arr: T[], slug: string): T {
  return arr[slugHash(slug) % arr.length];
}

const INTRO_VARIANTS: Record<string, ((n: string) => string)[]> = {
  ai: [
    (n) => `Оплатить ${n} российской картой невозможно — сервис не принимает карты РФ и отклоняет платежи по BIN 220. Ниже — зарубежные виртуальные карты в USD, которыми пользователи EraPay успешно оплачивают подписку ${n} за один вечер.`,
    (n) => `Биллинг ${n} требует карту в долларах и часто перепроверяет регион аккаунта. Мы собрали виртуальные карты, которые проходят у ${n} без запросов документов и без переоформления региона.`,
    (n) => `Чтобы оплатить ${n} из России, нужна карта в USD и аккаунт с непророссийским регионом. В подборке — карты, которые редакция протестировала именно на ${n}: комиссии, лимиты и скорость выпуска сверены.`,
  ],
  streaming: [
    (n) => `Подписка ${n} из России не оформляется: сервис проверяет регион карты и блокирует платёж. Мы собрали виртуальные карты с BIN нейтральных стран, которые ${n} принимает без дополнительной верификации.`,
    (n) => `${n} привязывает регион аккаунта к стране карты — сменить биллинг «на лету» нельзя. В рейтинге — карты, которые открывают доступ к ${n} и выдерживают рекуррентные списания без сбоев.`,
    (n) => `Оплата ${n} требует стабильной зарубежной карты для ежемесячных списаний и совпадения региона. Ниже — проверенные виртуальные карты, которые не «слетают» на продлении ${n}.`,
  ],
  games: [
    (n) => `${n} не принимает карты российских банков, а региональные кошельки давно отвязаны от рубля. В подборке — зарубежные виртуальные карты, которые проходят в ${n} без ошибки «Payment declined».`,
    (n) => `Цены в ${n} зависят от региона магазина, а платёж — от страны карты. Мы отобрали карты, с которыми можно пополнить кошелёк ${n} и покупать игры по локальным ценам без блокировок.`,
    (n) => `Чтобы купить или пополнить ${n} из России в 2026 году, нужна карта из «дружелюбного» региона. В рейтинге — карты, которые ${n} принимает с первой попытки, с прозрачной комиссией и быстрым выпуском.`,
  ],
  shopping: [
    (n) => `${n} отклоняет карты РФ на этапе оформления заказа и часто требует адресную верификацию (AVS). Мы отобрали виртуальные карты с корректным billing-адресом и достаточным лимитом.`,
    (n) => `Для покупок в ${n} нужен рабочий billing-адрес и валюта магазина — российские карты обычно не проходят даже AVS. В подборке — карты, у которых адрес и BIN согласованы, что снимает большинство отказов.`,
    (n) => `${n} проверяет пару «карта + адрес доставки»: несовпадение — и заказ отменяется. Ниже — карты, которые проходят проверку ${n} и подходят под доставку через посредников.`,
  ],
  ads: [
    (n) => `Пополнение рекламного кабинета ${n} из России — отдельная задача: нужны высокие лимиты, автосписания и BIN, который не триггерит модерацию. Карты в рейтинге — те, что арбитражники используют для ${n} без блокировок.`,
    (n) => `${n} жёстко смотрит на новые карты и легко отправляет кабинет на проверку. В подборке — карты с прогретой историей и высокими лимитами, которые ${n} списывает штатно и без «слётов».`,
    (n) => `Для рекламы в ${n} важнее всего не комиссия, а стабильность автосписаний и лимит. Мы собрали карты, которые агентства крутят в ${n} на серьёзных бюджетах без риска потерять кабинет.`,
  ],
  travel: [
    (n) => `${n} проводит предавторизацию суммы и требует, чтобы карта принадлежала клиенту. Виртуальные карты для ${n} должны выдерживать hold на всю стоимость брони и работать в мультивалюте.`,
    (n) => `На бронировании в ${n} отель или сервис резервирует деньги (hold) — карте нужен запас и мультивалюта. В подборке — карты, которые проходят предавторизацию ${n} без отказа на стойке.`,
    (n) => `Оплата в ${n} часто идёт в валюте страны отеля, а часть сумм замораживается заранее. Ниже — карты, которые редакция проверила на реальных бронированиях ${n}.`,
  ],
  work: [
    (n) => `Подписка ${n} требует стабильной карты для регулярных списаний: любое отклонение — и доступ к аккаунту приостанавливается. В рейтинге — карты, которые ${n} списывает без сбоев.`,
    (n) => `${n} часто предлагает годовой тариф и списывает VAT/налог сверху — нужны карта с запасом и предсказуемые комиссии. Мы отобрали именно такие карты для ${n}.`,
    (n) => `Для бизнес-аккаунта в ${n} важна карта, которую сервис не отбросит на первом же продлении. В подборке — карты с ровной историей списаний и корректным юридическим адресом.`,
  ],
};

function introFor(page: ServicePage): string {
  if (page.intro_text && page.intro_text.trim().length > 0) return page.intro_text;
  const variants = INTRO_VARIANTS[page.category];
  if (variants && variants.length > 0) return pick(variants, page.slug)(page.name);
  return `Оплата ${page.name} из России в 2026 году возможна через зарубежные виртуальные карты. Ниже — рейтинг проверенных вариантов с тарифами, лимитами и способами пополнения.`;
}

type Step = { t: string; d: string };

const STEP_TEMPLATES: Record<string, (n: string) => Step[]> = {
  ai: (n) => [
    { t: "Выберите карту в USD", d: `Возьмите из рейтинга карту с долларовым балансом — ${n} биллит именно в USD.` },
    { t: "Проверьте регион аккаунта", d: `Убедитесь, что регион аккаунта ${n} совпадает со страной карты, иначе оплата отклонится.` },
    { t: "Привяжите карту в биллинге", d: `Откройте настройки биллинга ${n} и добавьте карту как платёжный метод по умолчанию.` },
    { t: `Оплатите подписку ${n}`, d: `Подтвердите платёж — при первой оплате ${n} может запросить 3-D Secure, это норма.` },
  ],
  streaming: (n) => [
    { t: "Согласуйте регион", d: `Регион аккаунта ${n} должен совпадать со страной BIN карты — иначе платёж отклонят.` },
    { t: "Выпустите карту", d: `Оформите виртуальную карту из рейтинга — большинство карт для ${n} выдаётся за 5–15 минут без KYC.` },
    { t: "Настройте автоплатёж", d: `Привяжите карту к профилю ${n} и включите продление — ${n} списывает рекуррентно каждый период.` },
    { t: "Проверьте семейный план", d: `Если оформляете ${n} на семью, добавьте участников до первого списания, чтобы не потерять день.` },
  ],
  games: (n) => [
    { t: "Выберите регион магазина", d: `Определитесь с регионом аккаунта ${n} — от него зависят цены и способы оплаты.` },
    { t: "Выпустите карту под регион", d: `Возьмите карту с BIN, который ${n} принимает в выбранном регионе.` },
    { t: "Пополните кошелёк", d: `Внесите средства на кошелёк ${n} через карту — так удобнее, чем оплачивать каждую покупку.` },
    { t: "Купите игру", d: `Оплачивайте покупки в ${n} с баланса кошелька — карта участвует только на этапе пополнения.` },
  ],
  shopping: (n) => [
    { t: "Подготовьте адрес", d: `Заведите корректный billing-адрес в стране карты — ${n} сверяет его через AVS.` },
    { t: "Выпустите карту с запасом", d: `Возьмите карту с лимитом выше стоимости заказа: ${n} делает предавторизацию на полную сумму.` },
    { t: "Оформите заказ", d: `Укажите тот же адрес в billing и (при необходимости) адрес посредника в shipping ${n}.` },
    { t: "Оплатите в валюте магазина", d: `Дайте ${n} списать в валюте магазина — двойная конвертация обычно дороже.` },
  ],
  ads: (n) => [
    { t: "Выберите карту с высоким лимитом", d: `Для ${n} нужна карта, выдерживающая крупные автосписания без блокировки.` },
    { t: "Привяжите к кабинету", d: `Добавьте карту в биллинг ${n} как основной способ оплаты и пройдите верификацию.` },
    { t: "Прогрейте небольшим бюджетом", d: `Первые сутки крутите ${n} с малым дневным лимитом — снижает риск ручной проверки.` },
    { t: "Держите резерв", d: `Оставляйте на карте запас на 2–3 автосписания ${n}, чтобы не словить остановку кампаний.` },
  ],
  travel: (n) => [
    { t: "Оцените сумму hold", d: `${n} может заморозить полную стоимость брони — заложите её в баланс карты.` },
    { t: "Выпустите мультивалютную карту", d: `Отель по брони ${n} часто списывает в валюте страны — мультивалюта экономит на конвертации.` },
    { t: "Оформите бронь", d: `При бронировании через ${n} выберите вариант с бесплатной отменой, если не уверены в hold.` },
    { t: "Уточните оплату на месте", d: `Иногда ${n} даёт выбор «онлайн vs на стойке» — на стойке карту проверят повторно, будьте готовы к предавторизации.` },
  ],
  work: (n) => [
    { t: "Выберите тариф", d: `У ${n} годовой тариф обычно дешевле помесячного, но списание разовое и крупное — учитывайте лимит карты.` },
    { t: "Уточните аккаунт", d: `Для бизнес-аккаунта в ${n} часто нужен корректный юридический адрес и VAT-номер, иначе налог начислят сверху.` },
    { t: "Привяжите карту", d: `Добавьте карту в биллинг ${n} и убедитесь, что 3-D Secure у эмитента активирован.` },
    { t: "Настройте автопродление", d: `Включите автопродление ${n} и держите баланс — прерывание доступа к рабочему аккаунту дороже комиссии.` },
  ],
};

function stepsFor(page: ServicePage): Step[] {
  const factory = STEP_TEMPLATES[page.category];
  if (factory) return factory(page.name);
  return [
    { t: "Выберите карту", d: `Отсортируйте рейтинг по цене или скорости и выберите подходящую под ${page.name}.` },
    { t: "Оформите выпуск", d: "Пройдите регистрацию у эмитента. У большинства карт из рейтинга KYC не требуется." },
    { t: "Пополните через СБП", d: "Переведите рубли через СБП — карта автоматически конвертирует их в валюту баланса." },
    { t: `Оплатите ${page.name}`, d: `Введите данные карты в форме оплаты ${page.name} — платёж проходит как обычная зарубежная транзакция.` },
  ];
}

const CATEGORY_FAQ: Record<string, (n: string) => { q: string; a: string }[]> = {
  ai: (n) => [
    {
      q: `Нужен ли VPN, чтобы оплатить ${n}?`,
      a: `Для оплаты ${n} VPN не всегда обязателен, но при первой привязке карты рекомендуем включить VPN страны эмитента — это резко снижает вероятность ручной проверки платежа.`,
    },
    {
      q: `Влияет ли регион аккаунта ${n} на оплату?`,
      a: `Да. ${n} сверяет страну аккаунта со страной карты. Если регион RU — платёж отклонится независимо от карты; смените регион в настройках до первой оплаты.`,
    },
  ],
  streaming: (n) => [
    {
      q: `Что делать, если ${n} требует сменить регион?`,
      a: `Регион аккаунта ${n} должен совпадать со страной карты. Смените страну в профиле до привязки карты — сделать это после подписки сложнее.`,
    },
    {
      q: `Пройдёт ли рекуррентный платёж ${n}?`,
      a: `Да, если карта из рейтинга: у них история стабильных списаний, ${n} продлевает подписку без ручной валидации.`,
    },
  ],
  games: (n) => [
    {
      q: `Могут ли забанить аккаунт в ${n} за оплату зарубежной картой?`,
      a: `Оплата картой другой страны — не нарушение правил ${n}, если она принадлежит вам. Проблемы бывают только при смене региона с уже купленными играми — тут ${n} может ограничить возврат средств.`,
    },
    {
      q: `Почему цены в ${n} разные в разных регионах?`,
      a: `Издатели устанавливают локальные цены для ${n}. Регион аккаунта фиксируется на этапе первого пополнения — выбирайте его осознанно.`,
    },
  ],
  shopping: (n) => [
    {
      q: `Что такое AVS и почему ${n} его проверяет?`,
      a: `AVS — сверка billing-адреса на карте с адресом заказа. ${n} использует её для защиты от фрода; несовпадение адреса — самая частая причина отказа.`,
    },
    {
      q: `Можно ли использовать посредника для доставки из ${n}?`,
      a: `Да, ставьте адрес посредника в поле shipping, а billing оставьте страны карты — так ${n} проходит AVS и одновременно доставляет посылку в РФ.`,
    },
  ],
  ads: (n) => [
    {
      q: `Не заблокирует ли ${n} рекламный кабинет из-за новой карты?`,
      a: `${n} действительно проверяет новые платёжные методы. Снижайте риск: не меняйте карту резко на больших бюджетах, прогрейте её мелкими списаниями и держите один и тот же IP/устройство.`,
    },
    {
      q: `Какой лимит карты нужен для ${n}?`,
      a: `Ориентируйтесь на 2–3 дневных бюджета — ${n} списывает автоматически и не любит отказов. Карты из верхней части рейтинга допускают крупные автосписания.`,
    },
  ],
  travel: (n) => [
    {
      q: `Пройдёт ли hold в отеле при бронировании через ${n}?`,
      a: `Да, если на карте достаточно средств. Отель через ${n} блокирует сумму заранее — при выезде разморозка происходит автоматически в течение 3–7 дней.`,
    },
    {
      q: `Что выбрать — оплату онлайн или на месте?`,
      a: `Онлайн через ${n} безопаснее фиксирует курс и тариф; на стойке отель может списать в местной валюте с двойной конвертацией. Если карта мультивалютная — выбирайте валюту страны отеля.`,
    },
  ],
  work: (n) => [
    {
      q: `Годовая или месячная подписка ${n} — что выбрать?`,
      a: `Годовая ${n} дешевле в пересчёте, но списание разовое и крупное. Помесячная удобнее для тестирования и меньше «жжёт» лимит карты.`,
    },
    {
      q: `Начислит ли ${n} VAT сверху?`,
      a: `Да, для физлиц из ЕС и ряда стран ${n} добавляет VAT. С бизнес-аккаунтом и валидным VAT-номером налог обычно снимается.`,
    },
  ],
};

function faqFor(page: ServicePage): { q: string; a: string }[] {
  const n = page.name;
  const base: { q: string; a: string }[] = [
    {
      q: `Можно ли оплатить ${n} из России в 2026 году?`,
      a: `Оплатить ${n} российской картой напрямую нельзя — сервис отклоняет платежи по BIN РФ. Используйте зарубежную виртуальную карту из нашего рейтинга: пополните её через СБП и оплатите ${n} в один клик.`,
    },
    {
      q: `Какая карта лучше подходит для ${n}?`,
      a: `Лучше всего работают карты с BIN нейтральных стран (Армения, Казахстан, Кипр, Гонконг), быстрым выпуском и низкой комиссией на пополнение. В верхней части рейтинга — карты, которые редакция EraPay протестировала на ${n} лично.`,
    },
    {
      q: `Что делать, если платёж в ${n} отклонён?`,
      a: `Проверьте баланс и лимиты карты, включите VPN страны эмитента и повторите попытку через 15–30 минут. Если платёж по-прежнему не проходит — выберите другую карту из рейтинга: разные BIN дают разный результат.`,
    },
  ];
  const cat = CATEGORY_FAQ[page.category]?.(n) ?? [];
  return [...base, ...cat];
}

const CATEGORY_LABEL: Record<string, string> = {
  ai: "AI и нейросети",
  streaming: "Стриминг и медиа",
  games: "Игры",
  shopping: "Магазины",
  ads: "Реклама",
  travel: "Путешествия",
  work: "Работа и SaaS",
};

export const Route = createFileRoute("/service/$slug")({
  head: ({ loaderData }) => {
    const p = loaderData as { page?: ServicePage } | undefined;
    if (!p?.page) {
      return { meta: [{ title: "Сервис не найден · EraPay" }, { name: "robots", content: "noindex" }] };
    }
    const page = p.page;
    const url = `https://erapay.ru/service/${page.slug}`;
    return {
      meta: [
        { title: page.meta_title },
        { name: "description", content: page.meta_description },
        { name: "keywords", content: page.keyword },
        { property: "og:title", content: page.meta_title },
        { property: "og:description", content: page.meta_description },
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
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Главная", item: "https://erapay.ru/" },
              { "@type": "ListItem", position: 2, name: "Карты для сервисов", item: "https://erapay.ru/service" },
              { "@type": "ListItem", position: 3, name: page.name, item: url },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
              mainEntity: faqFor(page).map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        },
      ],
    };
  },
  loader: async ({ context, params }) => {
    const page = await context.queryClient.ensureQueryData(servicePageBySlugQueryOptions(params.slug));
    if (!page) throw notFound();
    await Promise.all([
      context.queryClient.ensureQueryData(cardsQueryOptions),
      context.queryClient.ensureQueryData(servicePagesByCategoryQueryOptions(page.category)),
    ]);
    return { page };
  },
  component: ServicePage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-primary">Страница сервиса не найдена</h1>
        <p className="mt-3 text-muted-foreground">Такого сервиса пока нет в базе EraPay.</p>
        <Link to="/" className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground">
          К рейтингу
        </Link>
      </div>
      <SiteFooter />
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="p-10 text-center text-sm text-muted-foreground">Ошибка: {error.message}</div>
  ),
});

function ServicePage() {
  const { slug } = Route.useParams();
  const { data: page } = useSuspenseQuery(servicePageBySlugQueryOptions(slug));
  const { data: cards } = useSuspenseQuery(cardsQueryOptions);
  const { data: related } = useSuspenseQuery(servicePagesByCategoryQueryOptions(page?.category ?? ""));

  if (!page) return null;

  const topCards = [...cards].sort((a, b) => a.rank - b.rank).slice(0, 5);
  const relatedOthers = related.filter((r) => r.slug !== page.slug).slice(0, 4);
  const faq = faqFor(page);
  const intro = introFor(page);
  const steps = stepsFor(page);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-10 sm:px-6 lg:px-8">
            <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-muted-foreground">
              <Link to="/" className="hover:text-primary">Главная</Link>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="hover:text-primary">Карты для сервисов</span>
              <ChevronRight className="h-3 w-3" aria-hidden />
              <span className="text-foreground">{page.name}</span>
            </nav>

            <div className="text-xs font-semibold uppercase tracking-wider text-accent">
              {CATEGORY_LABEL[page.category] ?? "Сервис"}
            </div>
            <h1 className="mt-2 max-w-3xl font-serif text-4xl font-bold tracking-tight text-primary sm:text-5xl">
              {page.h1}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {intro}
            </p>
            {page.slug === "facebook-ads" && (
              <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-foreground">
                * Компания Meta признана экстремистской организацией, её деятельность запрещена на территории РФ.
              </p>
            )}
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[1240px] px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Топ-5 карт для оплаты {page.name}
              </h2>
              <Link to="/" hash="rating" className="shrink-0 text-sm font-semibold text-accent hover:underline">
                Весь рейтинг →
              </Link>
            </div>
          </div>
          <RatingSection cards={topCards} />
        </section>

        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Как оплатить {page.name} из России
            </h2>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.t} className="rounded-lg border border-border bg-background p-5 shadow-sm">
                  <div className="font-serif text-2xl font-bold text-accent">{i + 1}</div>
                  <div className="mt-2 font-semibold text-primary">{s.t}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-[760px] px-4 py-12 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              Частые вопросы про оплату {page.name}
            </h2>
            <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-background shadow-sm">
              {faq.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none text-base font-semibold text-primary marker:hidden">
                    {f.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {relatedOthers.length > 0 && (
          <section className="border-b border-border bg-surface">
            <div className="mx-auto max-w-[1040px] px-4 py-12 sm:px-6 lg:px-8">
              <h2 className="font-serif text-2xl font-bold text-primary sm:text-3xl">
                Похожие сервисы
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ещё карты для {CATEGORY_LABEL[page.category]?.toLowerCase() ?? "этой категории"}.
              </p>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {relatedOthers.map((r) => (
                  <li key={r.slug}>
                    <Link
                      to="/service/$slug"
                      params={{ slug: r.slug }}
                      className="block rounded-lg border border-border bg-background p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-md"
                    >
                      <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                        {CATEGORY_LABEL[r.category] ?? "Сервис"}
                      </div>
                      <div className="mt-1 font-serif text-lg font-bold text-primary">{r.name}</div>
                      <div className="mt-2 text-xs text-muted-foreground">Карты для оплаты {r.name} →</div>
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