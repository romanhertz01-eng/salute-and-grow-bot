
CREATE TABLE public.service_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  h1 TEXT NOT NULL,
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  intro_text TEXT,
  keyword TEXT NOT NULL,
  priority SMALLINT NOT NULL DEFAULT 2,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.service_pages TO anon;
GRANT SELECT ON public.service_pages TO authenticated;
GRANT ALL ON public.service_pages TO service_role;

ALTER TABLE public.service_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published service pages viewable by everyone"
ON public.service_pages FOR SELECT
USING (published = true);

CREATE INDEX service_pages_category_idx ON public.service_pages(category);

INSERT INTO public.service_pages (slug, name, category, h1, meta_title, meta_description, keyword, priority) VALUES
('chatgpt','ChatGPT','ai',
 'Лучшие карты для оплаты ChatGPT из России в 2026 году',
 'Карта для оплаты ChatGPT из РФ 2026 — рейтинг и сравнение | EraPay',
 'Как оплатить ChatGPT Plus из России в 2026 году: рейтинг зарубежных виртуальных карт, тарифы, комиссии и способы пополнения через СБП.',
 'карта для оплаты chatgpt', 1),
('claude','Claude','ai',
 'Лучшие карты для оплаты Claude из России в 2026 году',
 'Карта для оплаты Claude из РФ 2026 — рейтинг и сравнение | EraPay',
 'Оплата Claude Pro российской картой невозможна. Подобрали зарубежные виртуальные карты, которыми пользователи EraPay успешно оплачивают Anthropic Claude.',
 'карта для оплаты claude', 2),
('netflix','Netflix','streaming',
 'Лучшие карты для оплаты Netflix из России в 2026 году',
 'Карта для оплаты Netflix из РФ 2026 — рейтинг и сравнение | EraPay',
 'Оплатить подписку Netflix российской картой нельзя. Рейтинг зарубежных виртуальных карт, которые работают с Netflix в 2026 году.',
 'карта для оплаты netflix', 1),
('spotify','Spotify','streaming',
 'Лучшие карты для оплаты Spotify из России в 2026 году',
 'Карта для оплаты Spotify из РФ 2026 — рейтинг и сравнение | EraPay',
 'Как оплатить Spotify Premium из России: сравнение виртуальных карт, тарифы, комиссии, скорость выпуска. Проверено редакцией EraPay.',
 'карта для оплаты spotify', 1),
('steam','Steam','games',
 'Лучшие карты для оплаты Steam из России в 2026 году',
 'Карта для оплаты Steam из РФ 2026 — рейтинг и сравнение | EraPay',
 'Пополнение кошелька Steam из России в 2026 году: рейтинг виртуальных карт, которые работают в Steam Store без блокировок региона.',
 'карта для оплаты steam', 1),
('playstation','PlayStation','games',
 'Лучшие карты для оплаты PlayStation из России в 2026 году',
 'Карта для оплаты PS Store из РФ 2026 — рейтинг и сравнение | EraPay',
 'Оплата PlayStation Store и PS Plus российской картой не проходит. Рейтинг зарубежных карт с BIN, которые принимает Sony.',
 'карта для оплаты playstation', 2),
('amazon','Amazon','shopping',
 'Лучшие карты для оплаты Amazon из России в 2026 году',
 'Карта для оплаты Amazon из РФ 2026 — рейтинг и сравнение | EraPay',
 'Покупки на Amazon из России в 2026 году: зарубежные виртуальные карты с поддержкой AVS, лимиты, комиссии и способы пополнения.',
 'карта для оплаты amazon', 2),
('iherb','iHerb','shopping',
 'Лучшие карты для оплаты iHerb из России в 2026 году',
 'Карта для оплаты iHerb из РФ 2026 — рейтинг и сравнение | EraPay',
 'Оплата заказа на iHerb из России: рейтинг виртуальных карт с проверенной поддержкой iHerb, скорость выпуска и комиссии пополнения.',
 'карта для оплаты iherb', 3),
('google-ads','Google Ads','ads',
 'Лучшие карты для оплаты Google Ads из России в 2026 году',
 'Карта для Google Ads из РФ 2026 — рейтинг и сравнение | EraPay',
 'Пополнение рекламного кабинета Google Ads из России: карты с высоким лимитом, поддержкой автосписаний и адресной верификации.',
 'карта для оплаты google ads', 1),
('tiktok-ads','TikTok Ads','ads',
 'Лучшие карты для оплаты TikTok Ads из России в 2026 году',
 'Карта для TikTok Ads из РФ 2026 — рейтинг и сравнение | EraPay',
 'Оплата рекламного кабинета TikTok Ads из России: рейтинг зарубежных карт для арбитражников и агентств, лимиты и комиссии.',
 'карта для оплаты tiktok ads', 2),
('booking','Booking','travel',
 'Лучшие карты для оплаты Booking из России в 2026 году',
 'Карта для оплаты Booking из РФ 2026 — рейтинг и сравнение | EraPay',
 'Бронирование отелей на Booking.com из России: карты с поддержкой предавторизации, мультивалютные балансы и низкая конверсия.',
 'карта для оплаты booking', 1),
('adobe','Adobe','work',
 'Лучшие карты для оплаты Adobe из России в 2026 году',
 'Карта для оплаты Adobe Creative Cloud из РФ 2026 — рейтинг | EraPay',
 'Подписка Adobe Creative Cloud из России в 2026 году: рейтинг зарубежных виртуальных карт, которые Adobe принимает без сбоев.',
 'карта для оплаты adobe', 2);
