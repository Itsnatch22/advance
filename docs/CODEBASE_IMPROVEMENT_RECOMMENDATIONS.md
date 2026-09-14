# Codebase Improvement Recommendations

Generated from a targeted audit of the current Next.js App Router codebase, with extra attention to the new careers application flow, frontend quality, accessibility, security, and maintainability.

## Design Read

This is a public fintech marketing site plus operational admin tooling for EaziWage. Treat public pages as trust-first, conversion-focused product surfaces with a restrained premium visual language. Treat admin pages as dense operational tools where clarity, predictable controls, and fast repeated workflows matter more than decorative motion.

Recommended dials:

- `DESIGN_VARIANCE: 5` for product and careers pages, using targeted evolution instead of a full redesign.
- `MOTION_INTENSITY: 3` for forms and admin surfaces, reserving richer motion for marketing storytelling.
- `VISUAL_DENSITY: 5` for public product pages and `8` for admin pages.

## Highest Priority

### 1. Move Career Application Submission Behind a Server Route completed✅

Current signal:

- `app/careers/[slug]/apply/ApplicationForm.tsx` uploads resumes and inserts into `career_applications` directly from the browser Supabase client.
- The documented RLS model allows anonymous inserts, which is useful, but the client still owns file naming, payload shape, and submission timing.

Recommended change:

- Create `app/api/careers/[slug]/applications/route.ts`.
- Validate the full payload with `zod`.
- Add a dedicated `careerApplicationLimiter` in `lib/security/rate-limit.ts`.
- Perform the insert server-side.
- Prefer signed upload URLs or a server-mediated upload path for resumes.
- Add server-side checks that the career exists and `is_open = true`.

Why:

- Gives one hardened place for anti-abuse, validation, audit logging, consent timestamps, storage path rules, and future email notifications.
- Prevents clients from submitting arbitrary snapshots or malformed URLs.

Acceptance checks:

- Invalid file type, oversize file, closed role, duplicate rapid submissions, and missing consent all fail with clear errors.
- A successful submission creates exactly one application row and one resume object.

### 2. Add Route-Level Loading and Error Boundaries for Dynamic Career Segments completed✅

Current signal:

- Existing boundaries: `app/loading.tsx`, `app/error.tsx`, `app/careers/loading.tsx`, `app/careers/error.tsx`.
- Missing segment-specific boundaries for `app/careers/[slug]/` and `app/careers/[slug]/apply/`.

Recommended change:

- Add:
  - `app/careers/[slug]/loading.tsx`
  - `app/careers/[slug]/error.tsx`
  - `app/careers/[slug]/apply/loading.tsx`
  - `app/careers/[slug]/apply/error.tsx`

Why:

- The detail and apply pages fetch dynamic Supabase data. Segment-level boundaries keep failures local, improve perceived speed, and match App Router best practice.

Acceptance checks:

- Slow career fetches show skeletons that match the final layout.
- Supabase failures render an actionable retry state without taking down the whole careers section.

### 3. Tighten Image Remote Patterns

Current signal:

- `next.config.ts` allows all `https` and all `http` image hosts via `hostname: "**"`.

Recommended change:

- Replace the wildcard allowlist with explicit production image domains.
- Remove `http` unless a known required source cannot serve HTTPS.
- Keep `img-src` CSP aligned with the same set of approved hosts.

Why:

- Reduces image proxy abuse, avoids mixed-content risk, and makes the production asset policy auditable.

Acceptance checks:

- All first-party assets still render.
- External logos, GIFs, and campaign images render only from approved domains.

### 4. Rationalize Motion and Icon Libraries

Current signal:

- The codebase uses both `framer-motion` and `motion/react`.
- The codebase uses both `lucide-react` and `@tabler/icons-react`.

Recommended change:

- Pick one motion import path for new work. Prefer `motion/react` for new components, then migrate opportunistically.
- Pick one primary icon family for product UI. Since Lucide is already widespread, either formalize Lucide as the project standard or intentionally migrate to Tabler/Radix for thinner strokes.
- Document icon stroke width and button icon sizing in a short design-system note.

Why:

- Reduces bundle drift and visual inconsistency.
- Makes future component reviews simpler.

Acceptance checks:

- New components do not introduce a third icon set.
- Buttons, badges, and form states use consistent icon sizing and stroke weight.

## Product and UX Improvements

### 5. Create a Careers Admin Review Flow completed✅

Current signal:

- The career application feature intentionally leaves admin review out of scope.

Recommended change:

- Add an authenticated admin page for `career_applications`.
- Include filters by role, status, submission date, and candidate search.
- Add status transitions: `submitted`, `reviewing`, `shortlisted`, `rejected`, `hired`.
- Add an audit trail for status changes.
- Add resume access through signed URLs rather than public storage URLs.

Why:

- The application intake is useful only when the team can triage candidates securely and consistently.

Acceptance checks:

- Admins can review applications without exposing resumes publicly.
- Every status change records actor, timestamp, old status, and new status.

### 6. Improve Application Form Ergonomics completed✅

Current signal:

- The apply form has required fields, file validation, upload status, success, and error states.
- It does not yet use shared form primitives or schema validation.

Recommended change:

- Extract reusable `FormField`, `FileUploadField`, and `ConsentCheckbox` components.
- Use `react-hook-form` plus `zod` for typed validation.
- Add per-field inline errors instead of one global error for every validation failure.
- Preserve selected file state visually and support keyboard removal.
- Add helper text for allowed file types and size before the user selects a file.

Why:

- Improves accessibility and makes future forms cheaper to build.

Acceptance checks:

- Form can be completed fully with keyboard only.
- Screen readers announce validation errors next to the relevant field.
- Submit button communicates upload and submit stages without layout shift.

### 7. Add Candidate Confirmation Email completed✅

Current signal:

- Contact and partner flows already use Resend email patterns.
- Career application submission currently has only an in-page success message.

Recommended change:

- Add a candidate confirmation email and internal hiring notification after server-side submission.
- Reuse existing email config conventions.
- Include role title, submitted timestamp, and next steps.

Why:

- Gives applicants confidence and alerts the hiring team without needing to poll the database.

Acceptance checks:

- Email failure does not roll back the application insert.
- Email errors are logged with enough context for operations.

### 8. Add Structured Data to Careers completed✅

Recommended change:

- Add `JobPosting` JSON-LD on `app/careers/[slug]/page.tsx`.
- Include title, description, employment type, hiring organization, applicant location requirements if relevant, job location, date posted, valid through, and salary when present.

Why:

- Improves search engine understanding of job pages and helps preserve SEO value after the route change from `[id]` to `[slug]`.

Acceptance checks:

- Rich results validation passes for open roles.
- Closed roles either omit `JobPosting` or set a valid expiry strategy.

## Engineering Quality

### 9. Add a Public API Protection Matrix

Current signal:

- Many public endpoints use rate limiting.
- Some routes use generic `rateLimiter` even when named limiters exist.
- There is no obvious single document mapping each endpoint to auth, validation, rate limit, and abuse controls.

Recommended change:

- Create a docs table for every `app/api/**/route.ts` endpoint:
  - Method
  - Auth requirement
  - Validation schema
  - Rate limiter
  - External side effects
  - Logging/audit behavior
  - CORS policy

Why:

- This app has contact, sales, AI, admin, campaign, upload, webhook, and subscription endpoints. A matrix makes gaps visible before they become production incidents.

Acceptance checks:

- Every public POST has validation and a rate limiter.
- Every admin endpoint has an auth guard and audit behavior where it mutates data.
- Webhooks document signature verification.

### 10. Revisit CSP and Inline Script Policy

Current signal:

- `next.config.ts` sets CSP headers globally.
- `script-src` includes `'unsafe-inline'` and `'unsafe-eval'`.

Recommended change:

- Move toward nonce-based scripts where practical.
- Keep development-only allowances out of production.
- Document each third-party domain and the feature that requires it.

Why:

- EaziWage handles financial and applicant data. A stricter CSP is a high-value security improvement.

Acceptance checks:

- Production pages load without CSP violations.
- Removing an approved script domain has a documented owner and feature impact.

### 11. Strengthen Environment Configuration Boundaries

Current signal:

- `env.ts` validates many required variables.
- Some route files still read `process.env` directly and create service clients locally.

Recommended change:

- Centralize server-only config access through `getEnv()`.
- Add a separate optional-env helper for integrations that can degrade gracefully.
- Prefer shared Supabase service helpers rather than repeated `createClient` setup inside routes.

Why:

- Reduces inconsistent failure behavior and makes deployments easier to reason about.

Acceptance checks:

- Server routes do not duplicate service-role client construction.
- Missing optional integrations return controlled 503s or disable only the affected feature.

### 12. Convert Plain Content Images to `next/image`

Current signal:

- Plain `<img>` appears in app and component files where content images are rendered.

Recommended change:

- Use `next/image` for content images.
- Keep raw `<img>` only where it is necessary, such as generated email HTML, third-party GIF picker internals, or browser APIs that require it.

Why:

- Improves LCP, sizing stability, image optimization, and accessibility review.

Acceptance checks:

- Public pages do not introduce layout shift from unsized content images.
- Exceptions are documented with comments or kept inside clearly isolated utility components.

## Visual System Improvements

### 13. Define a Small EaziWage UI Surface Guide

Recommended change:

- Add `docs/DESIGN_SYSTEM_NOTES.md` or extend the existing docs with:
  - Primary accent: EaziWage green.
  - Neutral scale usage.
  - Corner radius rules for buttons, inputs, cards, and shells.
  - Motion duration and easing tokens.
  - Form field anatomy.
  - Admin density rules.

Why:

- The codebase already has polished pieces, but patterns are repeated by hand. A short guide prevents drift.

Acceptance checks:

- New pages can be reviewed against concrete tokens instead of taste alone.
- Marketing pages and admin pages have distinct density rules.

### 14. Replace Decorative Orbs on Form-Heavy Pages completed✅

Current signal:

- `FloatingOrb` appears on careers and application pages.

Recommended change:

- Keep decorative motion for brand/marketing sections.
- On application, auth, admin, and payment-like flows, reduce visual noise and prioritize stable form hierarchy.
- Use subtle grid, spacing, and clear status panels rather than animated background objects.

Why:

- Form completion benefits from calmer surroundings, especially on mobile and lower-power devices.

Acceptance checks:

- Application pages pass reduced-motion review.
- No animated background element competes with field focus, error state, or submit feedback.

### 15. Replace `min-h-screen` with `min-h-[100dvh]` on Viewport-Filling Pages

Current signal:

- Multiple pages use `min-h-screen`.

Recommended change:

- For viewport-filling layouts, use `min-h-[100dvh]` to avoid mobile browser chrome jumps.

Why:

- More stable on mobile Safari and modern mobile browsers.

Acceptance checks:

- Hero, auth, loading, not-found, and form pages do not jump when the mobile browser address bar changes.

## Testing and Verification

### 16. Add Tests Around Careers Helpers and Submission Flow

Recommended change:

- Unit test `formatLocation`, `formatSalary`, `formatDepartment`, and `getApplyHref`.
- Add route handler tests for the future server-side application endpoint.
- Add an E2E happy path for applying to an open role and a blocked path for a closed role.

Why:

- The career flow touches routing, Supabase data, storage, validation, consent, and candidate-facing UX.

Acceptance checks:

- Slug routes are covered.
- External `apply_link` roles do not show internal form behavior.
- Closed roles cannot be submitted through the UI or API.

### 17. Add Build, Type, Lint, and Accessibility Gates to PR Checks

Current signal:

- Scripts exist for `build`, `lint`, `type-check`, and `test`.

Recommended change:

- Document and enforce the expected local verification sequence:
  - `npm run type-check`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
- Add Playwright or equivalent browser checks for high-value public flows.
- Add axe checks for forms, nav, dialogs, and admin tables.

Why:

- This app has enough surface area that regressions will otherwise hide in route-specific code.

Acceptance checks:

- CI blocks merges on type, lint, unit test, and production build failures.
- Core public flows are covered in browser-level tests.

## Suggested Implementation Order

1. Server-side career applications endpoint with rate limiting and validation.
2. Careers detail/apply loading and error boundaries.
3. Resume storage access model review, preferably signed URLs.
4. Careers admin review workflow.
5. Image domain allowlist and CSP tightening.
6. Design system notes for tokens, forms, motion, and admin density.
7. Motion/icon library standardization.
8. Careers structured data and route helper tests.
9. Public API protection matrix.
10. Accessibility and E2E coverage for application, contact, sales, and admin login flows.

## Quick Wins

- Replace `min-h-screen` with `min-h-[100dvh]` on careers, auth, loading, and not-found pages.
- Add helper text under the resume upload field before file selection.
- Add segment-level `loading.tsx` and `error.tsx` for career detail/apply routes.
- Add `careerApplicationLimiter` instead of reusing a generic limiter.
- Narrow `next.config.ts` image domains.
- Add `JobPosting` JSON-LD to open career detail pages.
- Document the chosen icon family and motion import path.
