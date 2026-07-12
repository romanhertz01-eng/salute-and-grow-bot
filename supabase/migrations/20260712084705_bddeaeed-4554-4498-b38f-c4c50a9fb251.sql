-- Add demo calculation fields to cards.
-- Demo rate: 1$ = 100₽. Rules for parsing existing text tariffs:
--   * range "X to Y" -> upper Y (conservative)
--   * "from X" -> X
--   * ambiguous / not a percent -> NULL

ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS service_cost_rub_year integer NULL,
  ADD COLUMN IF NOT EXISTS topup_fee_percent numeric(4,1) NULL;

-- Seed demo data (idempotent by slug)
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 0    WHERE slug = 'plati-po-miru';
UPDATE public.cards SET service_cost_rub_year = 690,  topup_fee_percent = 0    WHERE slug = 'wanttopay';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 0    WHERE slug = 'wayment';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 0    WHERE slug = 'aifory-pro';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 3    WHERE slug = 'flowbit-finance';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 3    WHERE slug = 'zarub';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 3.5  WHERE slug = 'o-plata';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = NULL WHERE slug = 'mig-pay';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 3    WHERE slug = 'chocopay';
UPDATE public.cards SET service_cost_rub_year = 2000, topup_fee_percent = NULL WHERE slug = 'easy-payments';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 3    WHERE slug = 'terbium-wallet';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 4    WHERE slug = 'cardclub';
UPDATE public.cards SET service_cost_rub_year = 200,  topup_fee_percent = 1    WHERE slug = 'morekart';
UPDATE public.cards SET service_cost_rub_year = 400,  topup_fee_percent = 3    WHERE slug = 'e-pn';
UPDATE public.cards SET service_cost_rub_year = 0,    topup_fee_percent = 3.5  WHERE slug = 'heleket';