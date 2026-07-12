ALTER TABLE public.cards
  ADD COLUMN IF NOT EXISTS issue_cost_rub integer,
  ADD COLUMN IF NOT EXISTS issue_speed_minutes integer;