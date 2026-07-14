-- Migration: Recipient Lists for Campaigns
-- Created: 2026-07-14

CREATE TABLE IF NOT EXISTS public.recipient_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recipient_list_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES public.recipient_lists(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  subscriber_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recipient_list_email ON public.recipient_list_members(email);
