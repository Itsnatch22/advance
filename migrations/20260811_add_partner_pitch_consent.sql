-- Migration: Add pitch_deck_url and consent columns to partner_applications
-- Date: 2026-08-11
-- Adds a nullable pitch_deck_url TEXT and a non-null consent BOOLEAN with default false
-- Rollback (manual): ALTER TABLE partner_applications DROP COLUMN IF EXISTS pitch_deck_url; ALTER TABLE partner_applications DROP COLUMN IF EXISTS consent;

BEGIN;

ALTER TABLE public.partner_applications
  ADD COLUMN IF NOT EXISTS pitch_deck_url TEXT,
  ADD COLUMN IF NOT EXISTS consent BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS consent_given_at TIMESTAMPTZ NULL;

-- Index to help queries that filter by consent
CREATE INDEX IF NOT EXISTS idx_partner_applications_consent ON public.partner_applications (consent);
-- Optional index for consent timestamp queries
CREATE INDEX IF NOT EXISTS idx_partner_applications_consent_given_at ON public.partner_applications (consent_given_at);

COMMIT;
