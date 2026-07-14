-- Migration: Add campaign scheduling support
-- Created: 2026-07-14
-- Recreated to be idempotent and include status, locking, and useful indexes

BEGIN;

-- Keep a reference on campaigns to any external scheduled job (optional)
ALTER TABLE public.email_campaigns
  ADD COLUMN IF NOT EXISTS scheduled_job_id TEXT;

-- Schedules table (one row per scheduled send attempt)
CREATE TABLE IF NOT EXISTS public.email_campaign_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid NOT NULL REFERENCES public.email_campaigns(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'scheduled', -- scheduled | queued | running | completed | cancelled | failed
  scheduled_at timestamptz NOT NULL,
  timezone text NULL,
  attempt int NOT NULL DEFAULT 0,
  last_run_at timestamptz NULL,
  locked_by text NULL,
  created_by uuid NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes to support scheduler queries
CREATE INDEX IF NOT EXISTS idx_email_campaign_schedules_scheduled_at ON public.email_campaign_schedules(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_email_campaign_schedules_campaign_id ON public.email_campaign_schedules(campaign_id);
CREATE INDEX IF NOT EXISTS idx_email_campaign_schedules_status ON public.email_campaign_schedules(status);

COMMIT;

-- Notes:
-- - This migration is safe to re-run. If your environment uses an external scheduler (Trigger.dev, pg_cron), map scheduled_job_id on the campaigns row as needed.
-- - To enqueue sends, query for rows where status='scheduled' AND scheduled_at <= now() ORDER BY scheduled_at LIMIT N.
