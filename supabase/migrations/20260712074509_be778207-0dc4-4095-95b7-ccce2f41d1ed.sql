-- Demo sort keys for price/speed.
-- Demo currency rates: 1 USD = 100 RUB, 1 EUR = 110 RUB.
-- These are DEMO values derived from the display strings. When real tariffs
-- are loaded, the owner should refill these fields manually.

UPDATE public.cards SET
  issue_cost_rub = CASE slug
    WHEN 'plati-po-miru'   THEN 2990
    WHEN 'wanttopay'       THEN 990
    WHEN 'wayment'         THEN 2990
    WHEN 'aifory-pro'      THEN 1990
    WHEN 'flowbit-finance' THEN 869
    WHEN 'zarub'           THEN 800      -- 8 USD * 100
    WHEN 'o-plata'         THEN 800
    WHEN 'mig-pay'         THEN 800
    WHEN 'chocopay'        THEN 200      -- 2 USD * 100
    WHEN 'easy-payments'   THEN 19990
    WHEN 'terbium-wallet'  THEN 2000     -- 20 USD * 100
    WHEN 'cardclub'        THEN 3500     -- 35 USD * 100
    WHEN 'morekart'        THEN 0        -- range lower bound
    WHEN 'e-pn'            THEN 200      -- 2 USD * 100 (rub side also 200)
    WHEN 'heleket'         THEN 500      -- 5 USD * 100
    ELSE issue_cost_rub
  END,
  issue_speed_minutes = CASE slug
    WHEN 'plati-po-miru'   THEN 2
    WHEN 'wanttopay'       THEN 1        -- мгновенно
    WHEN 'wayment'         THEN 5
    WHEN 'aifory-pro'      THEN 15
    WHEN 'flowbit-finance' THEN 10
    WHEN 'zarub'           THEN 30
    WHEN 'o-plata'         THEN 60       -- 1 час
    WHEN 'mig-pay'         THEN 20
    WHEN 'chocopay'        THEN 15
    WHEN 'easy-payments'   THEN 4320     -- 3 дня
    WHEN 'terbium-wallet'  THEN 1440     -- 1 день
    WHEN 'cardclub'        THEN 60       -- 1 час
    WHEN 'morekart'        THEN 30       -- от 30 минут
    WHEN 'e-pn'            THEN 1        -- мгновенно
    WHEN 'heleket'         THEN 10
    ELSE issue_speed_minutes
  END
WHERE slug IN (
  'plati-po-miru','wanttopay','wayment','aifory-pro','flowbit-finance',
  'zarub','o-plata','mig-pay','chocopay','easy-payments',
  'terbium-wallet','cardclub','morekart','e-pn','heleket'
);