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

### 3. **`/admin` — Campaign Management**
- **Status:** Partially implemented
- **What works:**
  - Login page
  - Campaign creation UI
  - Email preview
- **Missing:**
  - Campaign editing after creation
  - Analytics dashboard (view stats)
  - Recipient list management
  - Template library
  - Scheduling
  - A/B testing
- **Impact:** High — Marketing automation incomplete
- **Effort:** 1-2 weeks

---

## 🟠 **HIGH PRIORITY — Broken/Incomplete Features**

### 4. **Newsletter Subscription Flow** ✅ *Just Fixed*
- **Issue:** Token validation was failing (64-char hex vs 36-char UUID)
- **Status:** FIXED (commit d428c6b)

### 5. **Email System** 🟡 *Partially Done*
- **Status:** Redesigned (commit febf70d); unsubscribe page has been refined, but missing:
  - Email template preview/rendering
  - Bounce handling
  - Delivery tracking
- **Impact:** Medium — Email reliability uncertain
- **Effort:** 1 week

### 6. **Wiza AI Chat** (`/wiza-ai-for-eaziwage`) ✅ *Mostly Fixed*
- **Status:** Functional and polished; shared hook now powers coach + widget
- **What works:**
  - Chat interface
  - Cohere API integration
  - Message history
- **Recently verified/fixed:**
  - File attachment processing reaches backend
  - Public widget conversation threading persists via Supabase
  - Rate limiting is enforced on chat/stream routes
  - Typing indicators and retry/error recovery exist
  - Duplicate hook consolidation compile issues fixed
- **Remaining:**
  - Coach-mode guest conversations are kept in browser message history, not persisted server-side
- **Impact:** Medium — Core feature works but lacks polish
- **Effort:** 0.5-1 day for remaining persistence decision

### 7. **Calculator** (`/calculator`) ✅ *Fixed*
- **Status:** Functional and production-polished
- **Fixed:**
  - NSSF fallback now comes from centralized config
  - Production `alert()` calls replaced with toasts
  - Formula clarity added to the results UI
  - Platform fee percentage now uses centralized config
- **Impact:** Low — Works but not production-ready
- **Effort:** Done

### 8. **Coverage Map** (`/coverage`) 🟡 *Partially Fixed*
- **Status:** Routes exist; endpoint now uses DB-side counts instead of transferring full employee rows
- **Fixed:**
  - Replaced full in-memory table scan with per-country count queries
- **Missing:**
  - Country data persistence
  - Real-time coverage status
  - Partner availability matrix
- **Impact:** Low-Medium — Nice-to-have feature
- **Effort:** 3-5 days

---

## 🟡 **MEDIUM PRIORITY — Code Quality & Architecture Issues**

### 9. **Duplicate Chat Implementations** ✅ *Fixed*
- **Status:** Consolidated into `hooks/useWizaChat.ts`
- **Former files removed:** 
  - `hooks/useWizaCoachChat.ts`
  - `hooks/useWizaWidgetChat.ts`
- **Validation:** TypeScript passes after consolidation fixes
- **Effort:** Done

### 10. **API Response Inconsistency** 🟡 *Started*
- **Issue:** Response envelopes differ across routes
  - Some return `{ data, error }`
  - Others return `{ resources, error }`
  - Others return `{ message, status }`
- **Affected Routes:** All `/api/*` routes
- **Progress:** `lib/utils/response.ts` provides standard response helpers, but routes still need migration
- **Impact:** Medium — Client code fragile
- **Effort:** 2-3 days (standardize envelope)

### 11. **Hardcoded Config Values** 🟡 *Started*
- **Examples:**
  - Contact: Support email
  - Admin: Email sender addresses
- **Missing:** Config/constants module
- **Progress:** `constants/config.ts` exists; calculator and platform fee now use it
- **Remaining:** Migrate email sender/support addresses and route-level constants
- **Impact:** Low — Workaround exists
- **Effort:** 0.5-1 day

### 12. **Font Loading** (`/unsubscribe` page) ✅ *Fixed*
- **Status:** No page-level Google Font `@import`; uses the app-level font setup
- **Impact:** Negligible
- **Effort:** Done

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

### 17. **Admin Audit Logs**
- **Status:** Not implemented
- **Missing:** Campaign send history, recipient tracking
- **Impact:** Low — Compliance feature
- **Effort:** 2-3 days

---

## ✅ **Completed & Working Well**

- Homepage + landing pages ✅
- Blog/Resources page (fixed this session) ✅
- Calculator + FX rates ✅
- Contact form ✅
- Email system (just redesigned) ✅
- Newsletter subscription (just fixed) ✅
- Partner onboarding form ✅
- Authentication (admin login) ✅
- Wiza AI chat (functional) ✅
- Navbar + Footer ✅

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

---

## 📝 **Notes**

- **Database:** Supabase setup appears complete; no schema issues detected
- **Environment:** `.env.local` now has correct URL formats (quotes removed)
- **Builds:** All recent changes build successfully (TypeScript passing)
- **Email:** Now properly branded and logo-enabled
- **Subscription:** Token validation fixed (64-char hex format)

**Next audit recommended:** 2 weeks (after docs + admin sprints)
