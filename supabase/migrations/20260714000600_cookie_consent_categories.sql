-- Add granular category breakdown to cookie_consents.
-- Previously only a flat accepted/rejected string was recorded, with no way
-- to distinguish "necessary only" from "necessary + analytics" consent.

ALTER TABLE public.cookie_consents
  ADD COLUMN IF NOT EXISTS categories jsonb NOT NULL DEFAULT '{"necessary": true, "analytics": false}'::jsonb;

COMMENT ON COLUMN public.cookie_consents.categories IS
  'Per-category consent snapshot at time of choice, e.g. {"necessary": true, "analytics": true}. user_choice remains a derived summary label.';
