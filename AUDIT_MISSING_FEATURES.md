# 🔍 EaziWage Website Audit — Missing Features & Incomplete Implementations

**Date:** July 13, 2026  
**Status:** ACTIVE (Implementation pass resumed July 14, 2026)

---

## 📋 Summary

The website is **70% complete**. Core functionality works, but several pages are placeholders, and multiple features need implementation or refinement. Below is a prioritized breakdown.

---

## 🔴 **CRITICAL — Pages Not Implemented**

### 1. **`/docs`** — "Coming Soon"
- **Status:** Placeholder page only
- **Content:** Lottie animation + CTA to email support
- **Missing:**
  - API documentation
  - SDK guides
  - Integration recipes
  - OpenAPI spec
- **Impact:** High — Developers cannot self-serve; support load increases
- **Effort:** 2-3 weeks (comprehensive docs site)

### 2. **`/careers`** — "Coming Soon"
- **Status:** Placeholder page only
- **Content:** Generic roles, no job listings
- **Missing:**
  - Actual job postings (ATS integration)
  - Application flow
  - Team profiles
  - Culture content
- **Impact:** Medium — HR pipeline blocked
- **Effort:** 1 week (setup + content)

## 🟠 **HIGH PRIORITY — Broken/Incomplete Features**

### 5. **Email System** ✅ Fixed🟢
- **Status:** Implemented server-side preview rendering and basic delivery tracking + bounce handling hook.
- **What was done:**
  - Added admin preview endpoint: POST /api/admin/templates/preview — returns fully-rendered HTML using stored template and variables (sanitizes and wraps in campaign email shell).
  - Added Resend webhook handler: POST /api/webhooks/resend — updates email_campaign_logs delivery_status (sent, bounced, failed) by provider_message_id when Resend posts events.
  - Campaign send task already writes provider_message_id to email_campaign_logs so webhooks map to rows.
- **Notes / remaining operational steps:**
  - Configure Resend webhook URL to point to /api/webhooks/resend and set RESEND_WEBHOOK_SECRET in environment (recommended) so the handler can verify signatures.
  - Ensure Supabase SERVICE_ROLE key is available for webhook handler (it uses service role to update logs).
- **Impact:** Medium — Delivery tracking and bounce handling now supported; operational webhook configuration required.
- **Effort remaining:** Minimal (deployment + webhook config)


### 8. **Coverage Map** ✅ Fixed🟢
- **Status:** Implemented DB persistence and partner availability matrix support; real-time counts retained.
- **What was done:**
  - Added coverage_countries table (migration) to persist per-country counts and last_updated timestamp.
  - Added partner_availability table (migration) to map partner availability by country.
  - Coverage GET endpoint now returns live counts and a partner availability matrix (reads partner_availability if present).
  - Admin-only endpoint POST /api/admin/coverage/update to recompute counts and upsert into coverage_countries for operations that want a persisted snapshot.
- **Notes / remaining operational steps:**
  - Apply new Supabase migrations to create tables.
  - Populate partner_availability via admin UI or direct DB inserts (table created; no UI yet).
- **Impact:** Low-Medium — Coverage map now supports persisted snapshots and partner availability; UI can display partner matrix when backend populated.
- **Effort remaining:** Seed partner availability and optionally add admin UI for partner management (~0.5 day)

---

## 🟡 **MEDIUM PRIORITY — Code Quality & Architecture Issues**


### 11. **Hardcoded Config Values** ✅ Fixed🟢
- **Examples:**
  - Contact: Support email
  - Admin: Email sender addresses
- **What was done:** Centralized email senders and support addresses in `constants/config.ts` and replaced remaining hardcoded addresses across routes, emails, and UI components (contact, footer, subscription, partners, wiza summaries, unsubscribe, and related handlers).
- **Notes / remaining operational steps:** Ensure environment variables (RESEND_* and SUPPORT_EMAIL) are set in staging/production. Run Supabase/Trigger.dev deployments and update any mailer sender overrides if needed.
- **Impact:** Low — improves maintainability and makes sender addresses configurable
- **Effort:** Completed in this pass

---

## 🟢 **LOW PRIORITY — Optimization & Refinement**

### 13. **Performance Issues**
- **Coverage route:** Full table scan for aggregation (should be DB view)
- **Currency formatter:** `Intl.NumberFormat` recreated on every call (should cache)
- **Impact:** Negligible at current scale
- **Effort:** 1 day each

### 14. **Rate Limiting**
- **Status:** Implemented but only partially used
- **Missing routes:** Most public routes use `publicReadLimiter`, but:
  - Some routes missing rate limiting entirely
  - Limits not documented for clients
- **Impact:** Low — Protection exists
- **Effort:** 1 day

### 15. **Error Handling**
- **Status:** Inconsistent
- **Issues:**
  - Some routes return 500 on all errors
  - Others return 400 with detail
  - Client doesn't always surface error messages
- **Impact:** Low — Users get generic "try again" messages
- **Effort:** 2-3 days

### 16. **Webhook System** (`/api/webhooks`)
- **Status:** Route exists, logic TBD
- **Missing:** Actual webhook processing
- **Impact:** Low — Not MVP-critical
- **Effort:** 3-5 days

### 17. **Admin Audit Logs** ✅ Fixed🟢
- **Status:** Implemented (DB migration + helper + API endpoint)
- **What was done:** Added `admin_audit_logs` migration, `lib/admin/audit.ts` helper, and an admin API endpoint `POST/GET /api/admin/audit-logs` to write and query logs. The campaign send task now writes a `campaign.send` audit entry on completion.
- **Notes / remaining operational steps:** Apply Supabase migration to create the table in staging/production. Admin UI added at `/admin/audit-logs` (client page) for browsing logs. A retention/indexing migration was added to create extra indexes and a cleanup function; schedule `cleanup_admin_audit_logs()` daily (pg_cron or external scheduler) to enforce retention.
- **Impact:** Low — Adds compliance-grade audit trail for admin actions
- **Effort remaining:** Minimal (DB apply + optional UI polishing)

---

## 📊 **Effort Breakdown**

| Category | Days | Priority |
|----------|------|----------|
| **Docs site** | 14 | CRITICAL |
| **Admin campaigns (full)** | 7 | HIGH |
| **Email/newsletter refinements** | 3 | HIGH |
| **Careers (ATS)** | 5 | HIGH |
| **Wiza polish** | 1 | MEDIUM |
| **API consistency** | 3 | MEDIUM |
| **Duplicate chat cleanup** | 0 | DONE |
| **Config extraction** | 1 | LOW |
| **Performance tuning** | 2 | LOW |
| **Webhook impl** | 3 | LOW |
| **—** | **—** | **—** |
| **TOTAL** | **39 days** | — |

---

## 🎯 **Recommended Next Steps** (Priority Order)

### **Sprint 1 (Week 1-2):** High-Impact Wins
1. ✅ Fix docs site (placeholder → basic API docs + SDK links)
2. ✅ Complete admin campaigns (analytics + scheduling)
3. ✅ Polish Wiza AI (file handling, error UI)

### **Sprint 2 (Week 3-4):** Quality & Scale
1. ✅ Standardize API response envelopes
2. ✅ Consolidate chat hooks
3. ✅ Extract config/constants

### **Sprint 3 (Week 5+):** Content & Compliance
1. ✅ Launch careers page with real jobs
2. ✅ Add admin audit logs
3. ✅ Implement webhooks

### **Ongoing:** Tech Debt
- Cache formatters
- DB aggregation for coverage
- Comprehensive error handling

---

## 🔗 **Related Issues**

From `BACKLOG.md`:
- **H9:** Two chat implementations (noted above)
- **H10:** Chat route complexity (partially addressed)
- **M9-M19:** Config, consistency, performance issues (all noted above)


**Next audit recommended:** 2 weeks (after docs + admin sprints)
