# Next Steps — Post-Implementation Action Plan

**Date:** 2026-07-14
**Context:** Core campaign, email, coverage, webhook dispatcher, and admin-audit work have been implemented. This document lists immediate, prioritized operational and engineering steps to finalize the feature set and harden the platform for staging/production.

---

## 1) Apply database migrations (High — one-time) *Done🟢*
- Apply all new Supabase migrations in staging/production in this order:
  1. 20260714000000_campaign_schedules.sql (scheduling table + scheduled_job_id)
  2. 20260714000300_coverage_countries.sql (coverage persistence)
  3. 20260714000301_partner_availability.sql (partner matrix)
  4. 20260714000400_admin_audit_logs.sql (audit table)
  5. 20260714000500_admin_audit_logs_retention.sql (indexes + cleanup function)
- Verify migrations with a schema diff and run tsc --noEmit afterward.

## 2) Deploy and schedule Trigger.dev tasks (High)
- Deploy the trigger/campaign-send and trigger/campaign-scheduler tasks.
- If using Trigger.dev scheduler, map scheduled_job_id on email_campaigns rows to the job id when scheduling.
- If using pg_cron or external runner, schedule a periodic job that queries email_campaign_schedules where status='scheduled' and scheduled_at <= now() to enqueue sends.

## 3) Webhook operational setup (High)
- Configure and register provider webhooks:
  - Resend -> POST /api/webhooks/resend, set RESEND_WEBHOOK_SECRET *Added*
  - Calendly -> POST /api/webhooks (existing calendly handler), set CALENDLY_WEBHOOK_SIGNING_KEY *Already set*
- Ensure service role key in env is present for webhook handlers to update DB rows. *Already set*
- Create alerting/monitoring for webhook failures (log + retry metrics).

## 4) Admin UI & Auth hardening (Medium)
- Set ADMIN_UI_TOKEN env var in staging/production and provision `admin_token` cookie to authorized admins (or replace with proper server-side auth).
- Replace the temporary x-admin-id header usage in programmatic APIs with real auth (session or JWT middleware) for production.
- Add role-based access checks in admin API endpoints.

## 5) Retention & housekeeping (Medium)
- Schedule cleanup_admin_audit_logs() daily (pg_cron or external scheduler) to enforce retention.
- Review retention_days in admin_audit_logs_retention_settings and adjust to compliance requirements.

## 6) Tests, type checks, and CI (High)
- Run: tsc --noEmit; run existing test suite or a focused integration test covering: create campaign → schedule → send (dry-run) → webhook delivery update.
- Add a smoke test that runs on deployment: schedule a test campaign, assert email_campaign_logs updated and webhook path processed.

## 7) Seed data and admin conveniences (Low)
- Seed partner_availability rows (or provide admin UI to manage availability) so coverage map UI can show partner matrix.
- Seed any necessary sample audit logs for QA.

## 8) UI polish & validation (Low)
- Template picker / CSV recipient import: add CSV preview, validation feedback, and dedupe checks.
- Admin audit UI: add server-side filtering by date range, export CSV, and per-action drilldown.

## 9) Observability & alerts (Medium)
- Add logging and metrics for:
  - Campaign send failures and per-batch failure rates.
  - Webhook verification failures and processing errors.
  - Scheduler run durations and queue length.
- Integrate alerts (Slack/email) for critical failures.

## 10) Optional improvements (Future)
- Move expensive coverage aggregation into a DB view or materialized view for performance.
- Centralize webhook endpoints and public registration (consider keeping provider-specific verification paths if required by providers).
- Add end-to-end tests that simulate provider webhooks and assert audit logs, campaign logs, and coverage snapshots update correctly.

---

If you want, the next action I can take (one of these) is:
- Convert admin UI to use the project's real auth (server-side sessions) and add export/filtering (recommended), or
- Implement CSV preview/deduping for recipient import, or
- Add a deployment-ready Trigger.dev job manifest and a small CI job that applies Supabase migrations during deploy.

(Per your instruction: no extra recommendations will be made after this change.)
