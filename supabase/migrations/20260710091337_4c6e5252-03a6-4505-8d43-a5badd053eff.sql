
CREATE TABLE public.cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rank INTEGER NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  issuer_country TEXT,
  bank TEXT,
  payment_system TEXT,
  issue_cost TEXT,
  service_cost TEXT,
  topup_fee TEXT,
  topup_methods TEXT[] DEFAULT '{}',
  kyc BOOLEAN NOT NULL DEFAULT false,
  issue_speed TEXT,
  card_currency TEXT[] DEFAULT '{}',
  monthly_limit TEXT,
  apple_pay BOOLEAN NOT NULL DEFAULT false,
  google_pay BOOLEAN NOT NULL DEFAULT false,
  supported_services_count INTEGER DEFAULT 0,
  editorial_score NUMERIC(3,2) NOT NULL DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  bin_country TEXT,
  last_checked DATE NOT NULL DEFAULT CURRENT_DATE,
  verified BOOLEAN NOT NULL DEFAULT false,
  is_ad BOOLEAN NOT NULL DEFAULT false,
  affiliate_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.cards TO anon;
GRANT SELECT ON public.cards TO authenticated;
GRANT ALL ON public.cards TO service_role;

ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cards are viewable by everyone"
  ON public.cards FOR SELECT
  USING (true);

CREATE INDEX cards_rank_idx ON public.cards(rank);
