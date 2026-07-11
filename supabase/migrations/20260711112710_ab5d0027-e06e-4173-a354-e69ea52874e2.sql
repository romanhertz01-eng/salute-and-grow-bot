
CREATE TABLE public.guide_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  guide_type text NOT NULL CHECK (guide_type IN ('service','country')),
  target_name text NOT NULL,
  h1 text NOT NULL,
  meta_title text NOT NULL,
  meta_description text NOT NULL,
  keyword text NOT NULL,
  priority smallint NOT NULL DEFAULT 2,
  published boolean NOT NULL DEFAULT true,
  related_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.guide_pages TO anon, authenticated;
GRANT ALL ON public.guide_pages TO service_role;

ALTER TABLE public.guide_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Published guides viewable by everyone"
  ON public.guide_pages FOR SELECT
  USING (published = true);

-- Populate service guides
WITH s(slug, name) AS (
  VALUES
  ('chatgpt','ChatGPT'),('claude','Claude'),('midjourney','Midjourney'),('gemini','Gemini'),
  ('perplexity','Perplexity'),('cursor','Cursor'),('github-copilot','GitHub Copilot'),
  ('kling','Kling'),('higgsfield','Higgsfield'),('suno','Suno'),('runway','Runway'),
  ('sora','Sora'),('grok','Grok'),('elevenlabs','ElevenLabs'),('hailuo','Hailuo'),
  ('netflix','Netflix'),('youtube-premium','YouTube Premium'),('spotify','Spotify'),
  ('apple-music','Apple Music'),('apple-id','Apple ID'),('google-play','Google Play'),
  ('google-one','Google One'),('disney-plus','Disney+'),('hbo-max','HBO Max'),
  ('twitch','Twitch'),('patreon','Patreon'),('onlyfans','OnlyFans'),
  ('discord-nitro','Discord Nitro'),('telegram-premium','Telegram Premium'),
  ('duolingo','Duolingo'),('linkedin','LinkedIn'),('tinder','Tinder'),
  ('steam','Steam'),('playstation','PlayStation'),('xbox','Xbox'),('nintendo','Nintendo'),
  ('epic-games','Epic Games'),('roblox','Roblox'),('fortnite','Fortnite'),
  ('battle-net','Battle.net'),('genshin-impact','Genshin Impact'),
  ('adobe','Adobe'),('figma','Figma'),('notion','Notion'),('canva','Canva'),
  ('microsoft-365','Microsoft 365'),('zoom','Zoom'),('envato','Envato'),
  ('amazon','Amazon'),('ebay','eBay'),('aliexpress','AliExpress'),('iherb','iHerb'),
  ('asos','ASOS'),('shein','SHEIN'),('temu','Temu'),('farfetch','Farfetch'),('etsy','Etsy'),
  ('booking','Booking'),('airbnb','Airbnb'),('agoda','Agoda'),('trip-com','Trip.com'),
  ('hotels-com','Hotels.com'),('expedia','Expedia'),('ryanair','Ryanair'),
  ('wizz-air','Wizz Air'),('turkish-airlines','Turkish Airlines'),
  ('uber','Uber'),('bolt','Bolt'),('getyourguide','GetYourGuide'),
  ('paypal','PayPal'),('google-ads','Google Ads'),('facebook-ads','Facebook Ads'),
  ('tiktok-ads','TikTok Ads')
)
INSERT INTO public.guide_pages (slug, guide_type, target_name, h1, meta_title, meta_description, keyword, related_slug)
SELECT
  'kak-oplatit-' || s.slug,
  'service',
  s.name,
  'Как оплатить ' || s.name || ' из России в 2026 году',
  'Как оплатить ' || s.name || ' из России 2026 — пошаговая инструкция | EraPay',
  'Пошаговая инструкция: как оплатить ' || s.name || ' из России в 2026 году. Выбор зарубежной карты, пополнение через СБП, оплата и решение частых ошибок — только законные способы.',
  'как оплатить ' || lower(s.name) || ' из россии',
  s.slug
FROM s
ON CONFLICT (slug) DO NOTHING;

-- Populate country guides from country_pages
INSERT INTO public.guide_pages (slug, guide_type, target_name, h1, meta_title, meta_description, keyword, related_slug)
SELECT
  'kak-platit-v-' || cp.slug,
  'country',
  cp.name_ru,
  'Как платить в ' || cp.name_ru || ' россиянину в 2026 году',
  'Как платить в ' || cp.name_ru || ' россиянину 2026 — карты, наличные, банкоматы | EraPay',
  'Как платить в ' || cp.name_ru || ' россиянину в 2026: какие карты брать, наличные и валюта (' || cp.currency || '), пополнение до поездки, снятие в банкоматах и бесконтакт.',
  'как платить в ' || lower(cp.name_ru) || ' россиянину',
  cp.slug
FROM public.country_pages cp
WHERE cp.published = true
ON CONFLICT (slug) DO NOTHING;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_guide_pages_updated_at
BEFORE UPDATE ON public.guide_pages
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
