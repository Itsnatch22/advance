# Campaign Infra — Copilot Briefing

Database is done. Migrations applied, RLS on all 7 tables, FK fixed, functions patched. This briefing is app-code only.

## 1. Wire audit logging into recipient-lists routes
`logAdminAction` exists (`audit.ts`) and writes to `admin_audit_logs`. The recipient-lists routes don't call it. Add it to all three:

- `POST /admin/recipient-lists` → after list insert succeeds:
  `logAdminAction(user.id, 'recipient_list.create', { objectType: 'recipient_list', objectId: list.id, meta: { name, memberCount: emails?.length ?? 0 } })`
- `PATCH /admin/recipient-lists/[id]` → after update succeeds:
  `logAdminAction(user.id, 'recipient_list.update', { objectType: 'recipient_list', objectId: id, meta: { updates, emailsReplaced: !!parsed.data.emails } })`
- `DELETE /admin/recipient-lists/[id]` → after delete succeeds, before returning 204:
  `logAdminAction(user.id, 'recipient_list.delete', { objectType: 'recipient_list', objectId: id })`

`user` is already in scope in all three handlers via `getAuthenticatedAdmin`. Fire-and-forget is fine — don't block the response on it, but don't swallow errors silently either; `logAdminAction` already logs its own failures.

## 2. Fix the FK the schema now enforces
`recipient_list_members.subscriber_id` is now a real FK to `newsletter_subscriptions(id)`. Nothing currently writes it — both `POST` and `PATCH` build members as `{ list_id, email }` only, so it stays NULL, which is valid. No crash risk. But if you ever want list members linked back to real subscribers, that's the join point — not required for this pass, just don't be surprised it's constrained now.

## 3. Decide: is `recipient_lists` actually used yet?
`newsletter/send/route.ts` never queries `recipient_lists` — it takes a raw `recipients` array or falls back to all of `newsletter_subscriptions`. The list CRUD you built has no consumer. Either:
- (a) it's phase 2, leave it, or
- (b) wire it now: add an optional `listId` to `sendSchema`, and when present, resolve `recipients` by joining `recipient_list_members` on that `list_id` before the batch-send loop.

Don't build (b) unless told to — flagging it so it doesn't get shipped half-done.

## 4. Auth model inconsistency — not blocking, but fix before this ships wider
`admin_audit_logs` viewer (`page.tsx`) authenticates via a static `admin_token` cookie checked against `ADMIN_UI_TOKEN`. Every other admin route here (`recipient-lists`, `email_campaigns`) authenticates via Supabase auth + `system_admins` lookup. Two auth models on one product. If `ADMIN_UI_TOKEN` is a long-lived static secret with no per-user revocation, rotate it and consider migrating this page onto the same `getAuthenticatedAdmin` pattern as everything else.

## Out of scope — do not touch
- DB schema, RLS policies, indexes — done, don't regenerate or "improve" them.
- `newsletter/send/route.ts` rate limiting and batch logic — untouched, working, not part of this pass.