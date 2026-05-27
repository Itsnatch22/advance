# 🚨 UPDATE — Fixes by Priority

## 🟡 HIGH — Fix This Week

- Completed: **H7** — `lib/currency.ts` now has a refreshable FX cache with fallback rates
- Completed: **H14** — `hooks/use-outside-click.tsx` now uses a stable callback ref for outside-click handling
- **H9** — `hooks/useWizaCoachChat.ts` vs `hooks/useWizaWidgetChat.ts`: Two different streaming implementations for same feature
- **H10** — `app/api/chat/route.ts`: refactored chat logic into shared helper module and reduced route complexity; still needs full cleanup

## 🟠 MEDIUM — Fix This Month

- **M9** — `app/api/chat/route.ts`: Cohere (public chat) + Gemini (Wiza coach) fragmented
- **M11** — `app/api/coverage/route.ts`: Full in-memory table scan for country aggregation; add DB aggregation
- **M12** — `app/calculator/Calc.tsx`: Three `alert()` calls in production component; replace with toast
- **M13** — `app/api/partners/onboarding/route.ts`: Two emails sent sequentially; failure of first can block second
- **M14** — `lib/` root: Too many mixed concerns at root (calc, AI, auth, DB, FX, proxy)
- **M15** — `emails/SalesNotification.tsx`: Inline HTML string templates; no type safety/preview rendering
- **M16** — `app/unsubscribe/page.tsx`: Google Fonts via `@import` in `<style>`; use `next/font`
- **M17** — `currency.ts`: `new Intl.NumberFormat()` created fresh on every call; cache formatter
- **M18** — API routes: Inconsistent response envelopes across all routes; standardize
- **M19** — `app/calculator/Calc.tsx`: `NSSF tier1Ceiling = 7000` hardcoded; move to config
