-- =========================================================================
-- Migration: Email Campaign System
-- Created: 2026-07-06
--
-- Creates two new tables:
--   public.email_campaigns      — one row per campaign/newsletter
--   public.email_campaign_logs  — one row per recipient per campaign
--
-- Does NOT touch:
--   newsletter_subscriptions — marketing audience (read-only from here)
--   profiles                 — authenticated users (untouched)
--   system_admins            — admin permissions (read-only from here)
--
-- Apply via: Supabase SQL Editor → run this file, or supabase db push
-- =========================================================================

-- -------------------------------------------------------------------------
-- email_campaigns
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_campaigns (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  subject             TEXT        NOT NULL,
  title               TEXT        NOT NULL,
  html_content        TEXT        NOT NULL,
  plain_text_content  TEXT,
  status              TEXT        NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'scheduled', 'sending', 'completed', 'failed')),
  -- auth.users id stored as UUID; no FK so admin user deletion doesn't block audit trail
  created_by          UUID        NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  scheduled_at        TIMESTAMPTZ,
  sent_at             TIMESTAMPTZ,
  total_recipients    INTEGER,
  sent_count          INTEGER     NOT NULL DEFAULT 0,
  failed_count        INTEGER     NOT NULL DEFAULT 0
);

-- -------------------------------------------------------------------------
-- email_campaign_logs
-- -------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_campaign_logs (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id         UUID        NOT NULL
                      REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  recipient_email     TEXT        NOT NULL,
  -- nullable: subscriber may be deleted after send
  subscriber_id       UUID
                      REFERENCES public.newsletter_subscriptions(id) ON DELETE SET NULL,
  delivery_status     TEXT        NOT NULL DEFAULT 'queued'
                      CHECK (delivery_status IN ('queued', 'sent', 'failed', 'bounced')),
  provider_message_id TEXT,
  sent_at             TIMESTAMPTZ,
  opened_at           TIMESTAMPTZ,
  clicked_at          TIMESTAMPTZ,
  error_message       TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -------------------------------------------------------------------------
-- Indexes (performance for list + stats queries)
-- -------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_email_campaigns_status
  ON public.email_campaigns(status);

CREATE INDEX IF NOT EXISTS idx_email_campaigns_created_at
  ON public.email_campaigns(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_campaign_logs_campaign_id
  ON public.email_campaign_logs(campaign_id);

CREATE INDEX IF NOT EXISTS idx_campaign_logs_recipient
  ON public.email_campaign_logs(recipient_email);

CREATE INDEX IF NOT EXISTS idx_campaign_logs_status
  ON public.email_campaign_logs(delivery_status);

-- -------------------------------------------------------------------------
-- Auto-update updated_at on email_campaigns
-- -------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER trg_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- -------------------------------------------------------------------------
-- RLS — deny all by default; service-role key bypasses RLS in API routes.
-- The explicit admin policies below allow direct Supabase JS queries
-- (e.g. from client components that pass the user's JWT).
-- -------------------------------------------------------------------------
ALTER TABLE public.email_campaigns     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_campaign_logs ENABLE ROW LEVEL SECURITY;

-- Admins (in system_admins) can read and write campaigns
CREATE POLICY "admins_manage_campaigns"
  ON public.email_campaigns
  FOR ALL
  TO authenticated
  USING  (EXISTS (SELECT 1 FROM public.system_admins WHERE user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.system_admins WHERE user_id = auth.uid()));

-- Admins can view delivery logs (read-only; writes use service role)
CREATE POLICY "admins_view_campaign_logs"
  ON public.email_campaign_logs
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.system_admins WHERE user_id = auth.uid()));
