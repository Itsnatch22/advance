# Campaign Infra — Updated Briefing

Status: recent implementation pass completed for campaigns, email delivery, webhooks, and admin audit logs. This file summarizes what's been implemented and the remaining infra/dev tasks to close the loop.

## Implemented (already in repo)
- Admin audit logging: `lib/admin/audit.ts` + `admin_audit_logs` migration added; campaign send now writes a `campaign.send` audit entry on completion.
- Campaign scheduling: `supabase/migrations/20260714000000_campaign_schedules.sql` recreated (idempotent) and `email_campaign_schedules` table added with status, locking, and indexes.
- Trigger tasks: `trigger/campaign-send.ts` updated to write provider_message_id to `email_campaign_logs` and to call `logAdminAction(...)` after a send completes.
- Webhook dispatcher and handlers: unified `/api/webhooks/receive` + provider handlers (Resend handler implemented at `/api/webhooks/resend`); Calendly handler present. Delivery status updates map via `provider_message_id`.
- Admin UI: lightweight admin audit viewer implemented at `/admin/audit-logs` (server-side page that reads `ADMIN_UI_TOKEN` cookie) and retention migration + cleanup function `cleanup_admin_audit_logs()` added.

## Remaining Action Items (priority order)

1) Recipient-lists audit wiring (Dev)
- Add `logAdminAction` calls to recipient-list CRUD handlers as originally specified:
  - After create: `'recipient_list.create'` with meta { name, memberCount }
  - After update: `'recipient_list.update'` with meta { updates, emailsReplaced }
  - After delete: `'recipient_list.delete'`
- Keep calls fire-and-forget; they may log HTTP-visible warnings if insertion fails.

2) Decide & (optionally) wire recipient_lists into send flow (Product + Dev)
- Option A (defer): Leave `recipient_lists` as admin-managed but unused by send API (phase 2).
- Option B (implement): Add `listId` to sendSchema and, when present, resolve recipients from `recipient_list_members` (join on `newsletter_subscriptions` if needed) before batching. Only implement if product confirms.

3) Scheduler deployment & mapping (Infra + Dev)
- Deploy Trigger.dev jobs or configure pg_cron/external runner to poll `email_campaign_schedules`.
- When scheduling via an external scheduler, set `scheduled_job_id` on the `email_campaigns` row if you want cross-reference to the external job.
- Cron pattern for polling example: every minute, `SELECT * FROM email_campaign_schedules WHERE status='scheduled' AND scheduled_at <= now() ORDER BY scheduled_at LIMIT 50` then enqueue sends and set status to `queued`/`running`.

4) Webhook ops & secrets (Infra)
- Register provider webhooks:
  - Resend -> `/api/webhooks/resend`, set `RESEND_WEBHOOK_SECRET`
  - Calendly -> existing endpoint, set `CALENDLY_WEBHOOK_SIGNING_KEY`
- Ensure service role key is available to webhook handlers so they can update DB rows.

5) Admin UI auth convergence (Security)
- Current state: server-side audit page uses `ADMIN_UI_TOKEN` cookie check. Other admin APIs use Supabase auth + `getAuthenticatedAdmin`.
- Recommended: migrate admin UI to the same Supabase-based auth (or implement a short-lived signed cookie with rotation) to avoid dual auth models.

6) Retention & housekeeping (Infra)
- Schedule `cleanup_admin_audit_logs()` daily via pg_cron or external scheduler. Adjust `admin_audit_logs_retention_settings.retention_days` per compliance.

7) Tests & CI (Dev)
- Add a focused integration/smoke test: create → schedule → run send (dry) → simulate webhook → assert `email_campaign_logs` and `admin_audit_logs` updated.
- Run `tsc --noEmit` in CI after migrations are added.

8) Observability (Infra/Dev)
- Add metrics and alerts for: webhook verification failures, campaign batch failures, scheduler lag, and retention job errors.

## Notes & Decisions (archival)
- `recipient_list_members.subscriber_id` FK exists; current admin list endpoints do not populate it. If linking lists to subscribers is desired, update create/patch to resolve subscriber ids when present.
- `newsletter/send/route.ts` still supports raw recipient arrays and falls back to `newsletter_subscriptions`. Do not change without product sign-off.

---

If you want, I can open PRs for the recipient-list audit wiring and the optional `listId` send wiring; tell me to proceed and which option (A or B) to implement.  