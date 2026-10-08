# EaziWage Help Center — Spec

> Status: draft v1 · Owner: Mark · Last updated: 2026-10-08
> Stack: Next.js (App Router), Tailwind, Zod, Supabase

---

## 1. Why this exists

The current `/faq` page is generic and light on technical guidance. It answers *"what is EaziWage?"*. A help center answers *"why is my money stuck?"*. These are different jobs, so they stay separate and link to each other.

### Goals

- Let an employee or employer solve a problem **without contacting support**.
- When they can't, hand support **enough context** to skip the "what happened?" back-and-forth.
- Be written **from what is actually built**. No documenting features that aren't live.
- Be cheap to maintain: content ships with the feature PR.

### Non-goals (for v1)

- AI/predictive search. Prefix + fuzzy matching is enough until there are 50+ articles.
- A full ticketing system.
- Swahili or other locales (structure supports it; content does not exist yet).
- In-app authenticated help (account-specific diagnostics). Later.

### Audiences

| Audience | Weight in v1 | Typical state of mind |
| --- | --- | --- |
| Employees | **Heavy** | Anxious. Money is involved. Types 1–3 words. |
| Employers (HR / payroll admins) | Light but sharp | Professional, but a stuck onboarding can lose the contract. |

---

## 2. Information architecture & URLs

```text
/help                              Hub
/help/employees                    Audience landing (grouped by category)
/help/employees/[slug]             Article
/help/employers                    Audience landing
/help/employers/[slug]             Article
/help/contact                      Support form (accepts prefill params)
/help/err/[code]                   Redirects an error code to its article
```

Rules:

- **Slugs are lowercase, hyphenated, no apostrophes or special characters.**
  `cant-access-my-funds`, not `can't-access-my-funds` (apostrophes get percent-encoded and look broken when shared).
- **Organise by symptom, not by feature.** Users search "money didn't arrive", not "disbursements".
- **Folders encode audience only.** Category lives in frontmatter so reorganising never breaks URLs.
- `contact` and `err` are static segments and take priority over the dynamic `[audience]` segment. `[audience]` must be validated against `employees | employers` (`dynamicParams = false`).

---

## 3. Folder layout

```text
content/help/
  en/                              # locale folder from day one (costs nothing)
    employees/
      money-didnt-arrive.mdx
      cant-access-my-funds.mdx
      ...
    employers/
      add-your-employees.mdx
      ...

advance/
  app/help/
    layout.tsx                     # shell: header search, breadcrumbs, footer
    page.tsx                       # hub
    [audience]/
      page.tsx                     # audience landing
      [slug]/
        page.tsx                   # article renderer
    contact/
      page.tsx
      actions.ts                   # server action: validate (Zod) + insert
    err/
      [code]/route.ts              # code → article redirect
  lib/help/
    schema.ts                      # Zod frontmatter schema
    content.ts                     # read, parse, list, get-by-slug
    search.ts                      # MiniSearch setup + query helpers
    sanitize.ts                    # strip PII from logged queries
  components/help/
    HelpSearch.tsx                 # combobox with suggestions
    ArticleLayout.tsx
    Toc.tsx
    Callout.tsx
    Steps.tsx
    CountryNote.tsx
    StillStuck.tsx
    Feedback.tsx
    RelatedArticles.tsx
scripts/
  build-help-index.ts              # builds search index JSON
  validate-help-content.ts         # build-time checks (see §8)
```

Content tooling: `gray-matter` for frontmatter and an MDX renderer that works with RSC (e.g. `next-mdx-remote/rsc`). Verify current versions and APIs at implementation time.

---

## 4. Content model

### Frontmatter

```yaml
---
title: "My money didn't arrive"
description: "What to check when a withdrawal shows as sent but your wallet hasn't been credited."
audience: employees            # employees | employers
category: funds                # free-form, used for grouping on landing pages
countries: [all]               # all | KE | UG | TZ | RW (list)
errorCodes: [WD-102, WD-103]   # optional; powers /help/err/[code]
synonyms: [money not received, pesa, mpesa, withdrawal pending, missing money]
related: [cant-access-my-funds, wrong-phone-number-or-wallet]
urgent: true                   # pinned on hub; shows contact CTA more prominently
lastVerified: 2026-10-08       # ISO date; stale after 90 days
---
```

### Zod schema (sketch)

```ts
import { z } from "zod";

export const helpFrontmatter = z.object({
  title: z.string().min(5).max(90),
  description: z.string().min(20).max(180),
  audience: z.enum(["employees", "employers"]),
  category: z.string().min(2),
  countries: z.array(z.enum(["all", "KE", "UG", "TZ", "RW"])).min(1),
  errorCodes: z.array(z.string()).default([]),
  synonyms: z.array(z.string()).default([]),
  related: z.array(z.string()).default([]),
  urgent: z.boolean().default(false),
  lastVerified: z.coerce.date(),
});

export type HelpFrontmatter = z.infer<typeof helpFrontmatter>;
```

### Article anatomy

Every article follows the same skeleton. Consistency is what makes it feel technical without being unreadable.

```mdx
<Answer>
One or two sentences. The most likely fix, up front.
</Answer>

## What you're seeing
The symptom in the user's words (and any on-screen error text).

## Likely causes
Ordered by probability. Short.

## What to check
<Steps>
1. ...
2. ...
</Steps>

## Country notes
<CountryNote only="KE">Mobile money specifics for Kenya.</CountryNote>
<CountryNote only="UG">...</CountryNote>

## Still stuck?
(Rendered automatically by <StillStuck /> — do not hand-write.)
```

Authoring rules:

- Plain language. No internal jargon, table names, or service names.
- One problem per article. If it forks, split it.
- Never describe how limits, risk checks, or fraud rules are computed in enough detail to game them.
- Document only what is live. Paused or unbuilt features get **no** article.

---

## 5. Page designs

### Hub (`/help`)

1. Search bar (large, focused on load, with a specific placeholder, e.g. *"Search: money didn't arrive, verification failed…"*).
2. Audience cards: **Employees** / **Employers**.
3. Pinned urgent articles (max 2–3): `money-didnt-arrive`, `report-suspicious-activity`.
4. Contact footer.

### Audience landing

- Articles grouped by `category`, sorted by title (or an optional `order` field if needed later).
- Search scoped to that audience by default, with a toggle to search everything.

### Article page

1. Breadcrumbs: Help › Employees › Article
2. Title + "Last verified" date
3. `<Answer>` block
4. Body with sticky table of contents on desktop
5. `<StillStuck />` card (prefilled contact link)
6. `<Feedback />` ("Was this helpful?")
7. `<RelatedArticles />` from `related`

Metadata: `generateMetadata` from frontmatter; `generateStaticParams` for all articles; static rendering.

### Still-stuck card

Links to `/help/contact` with prefill query params: `?article=<slug>&code=<errorCode>&country=<KE>`. The contact page shows what will be sent and lets the user edit it. No silent data collection.

---

## 6. Search & suggestions

**Engine:** client-side MiniSearch over a build-time JSON index (title, description, synonyms, headings). No database involved.

**Suggestion dropdown behaviour**

- Suggest **articles directly** (not just query completions).
- Trigger at **2+ characters**.
- Maximum **5–6** suggestions (more causes choice paralysis).
- Each row: title, audience badge, matched text highlighted.
- Last row is always **"Search for '<query>'"** so free-text submission is possible.
- Zero results: show urgent articles + contact link. Never an empty box.
- Keyboard: ↑ ↓ move, Enter selects, Esc closes.
- Accessibility: proper ARIA combobox pattern (`role="combobox"`, `aria-expanded`, `aria-activedescendant`, `role="listbox"`/`option`).
- Matching: prefix + light fuzzy, boost on title and synonyms.

**Later (post-launch):** popular-query suggestions driven by real, sanitised search logs.

---

## 7. Data (Supabase)

Content is **not** stored in Supabase. Only interactions are. The tables below are **proposals**: check for an existing support/contact table before creating anything, and follow the single-call migration discipline.

| Table | Purpose | Key columns |
| --- | --- | --- |
| `help_feedback` | "Was this helpful?" votes | `article_slug`, `audience`, `helpful` (bool), `comment` (nullable), `country` (nullable), `created_at` |
| `help_search_events` | Zero-result / low-result queries → content backlog | `query_sanitized`, `result_count`, `audience_scope`, `created_at` |
| `support_requests` | Contact form submissions | `audience`, `article_slug`, `error_code`, `country`, `message`, `contact_email_or_phone`, `status`, `created_at` |

Access rules:

- Writes go through a **server action / route handler** with Zod validation and rate limiting, not directly from the browser.
- RLS: no public `select` on any of these. Insert via server only.
- `support_requests` contains personal data. Treat it accordingly (restricted access, retention window decided deliberately).

---

## 7.1 Upstream status banner

### Purpose

Many "my money didn't arrive" problems come from the mobile money provider (M-Pesa, MTN, Airtel, etc.), not from EaziWage. A banner on help pages tells users when a provider is having trouble, so they don't waste time troubleshooting something they can't fix.

### Decision (v1): manual flag

The team sets and clears a status flag by hand. Provider status pages are NOT used as a data source: public, machine-readable status feeds from mobile money providers appear to be unreliable or missing (to be verified per provider, per country), and third-party "is it down?" sites are mostly report-driven rather than monitored.

Automatic detection from EaziWage's own payout failure rates is a post-launch phase (see "Later").

### Data (proposal, not yet created)

Table: `service_status`

- provider (text)               e.g. mpesa, mtn, airtel
- country (text)                KE | UG | TZ | RW
- level (text)                  info | degraded | outage
- message_en (text)
- message_sw (text, nullable)   falls back to English
- starts_at (timestamptz)
- ends_at (timestamptz, nullable)
- created_by (uuid)
- created_at (timestamptz)

Access rules:

- Public read of ACTIVE rows only (via a server route, not direct table access).
- Writes restricted to authorised staff.
- Follow the single-call migration discipline when creating this table.

### Banner behaviour

- Shown at the top of help pages (and optionally in the app) when an active flag matches the user's country.
- Fetched client-side from a cached endpoint (about 60 second cache) so help pages stay statically rendered.
- Links to the most relevant article (for example, "Money didn't arrive").
- Disappears automatically when ends_at passes or the flag is cleared.
- No active flag means nothing renders: no empty space, no "all systems normal" noise.

### Wording rules

- State only what is known: "Some M-Pesa withdrawals are delayed. We are monitoring."
- Never name a cause that is not confirmed.
- Never promise outcomes or timelines that are not guaranteed.
- Tell the user what to do (for example, "Check your balance before trying again").
- Provide messages in each supported language; fall back to English.

### Later (not v1)

- Auto-detection: if payout failures or timeouts for a provider exceed a threshold within a short window, create a DRAFT flag for a human to confirm or dismiss. It never publishes on its own.
- Revisit direct provider status feeds if any provider starts publishing a dependable one.
- Subscribe or alert options for employer admins.

### Open items

- Who is authorised to set and clear flags?
- Who is on call to do it (especially around paydays)?
- Where is the admin UI for it (simple internal page vs. direct table edit)?

## 8. Quality gates (build-time)

`scripts/validate-help-content.ts` runs in CI and fails the build on:

- Frontmatter that fails the Zod schema.
- `related` slugs that don't exist.
- Duplicate `errorCodes` across articles.
- Duplicate slugs within an audience.
- Slugs containing anything other than `a-z`, `0-9`, `-`.
- `lastVerified` older than **90 days** (warning first, failure later once the habit exists).
- Missing required sections (`Answer`, `Likely causes`, `What to check`).

---

## 9. Privacy & security

- **Sanitise logged search queries.** People paste phone numbers, transaction IDs, and M-Pesa codes into search boxes. Before logging, drop or mask queries containing long digit runs (e.g. 6+ digits), `@`, or code-like tokens (e.g. 8–12 character uppercase alphanumerics). These are heuristics, so test them.
- Never log raw queries. Never log IPs alongside queries.
- The contact form must not ask for PINs, passwords, or full wallet credentials, and the page should say so.
- Help pages are public. Nothing account-specific, no internal thresholds, no fraud-rule detail.
- Rate-limit the contact action and feedback endpoint.

---

## 10. Launch scope (v1)

### Employees (8)

| Slug | Notes |
| --- | --- |
| `money-didnt-arrive` | Pinned. Cover upstream mobile-money delays. |
| `cant-access-my-funds` | Pinned-adjacent. |
| `why-is-my-limit-low` | High-volume question. |
| `verification-failed` | KYC rejections and what to retake. |
| `cant-log-in` | |
| `wrong-phone-number-or-wallet` | |
| `payday-deduction-explained` | Only if the deduction flow is live. |
| `report-suspicious-activity` | Pinned. Trust page. |

### Employers (3)

| Slug | Notes |
| --- | --- |
| `add-your-employees` | Onboarding the staff list. |
| `deductions-dont-match-payroll` | Finance teams will care. |
| `employee-left-with-balance` | Offboarding edge case. |

### Second wave

- Account deletion / recovery. **Blocked on a decision:** soft-delete window and retention rules for loan/repayment records (needs legal input; Kenya's Data Protection Act gives a right to erasure, and the regulator has held that controllers must respond to erasure requests within 14 days).
- Status banner for upstream outages (M-Pesa / MTN / Airtel).
- Country-specific article variants beyond notes.

---

## 11. Phases

| Phase | Deliverable |
| --- | --- |
| 1. Skeleton | Routes, layout, schema, content loader, 2 placeholder articles |
| 2. Authoring kit | MDX components, article template, validation script |
| 3. Search | Index build, `HelpSearch` combobox, zero-result state |
| 4. Interactions | Feedback + contact form + Supabase tables + sanitiser |
| 5. Content | The 11 launch articles, written against live features |
| 6. Polish | Metadata/SEO, a11y pass, mobile pass, link from `/faq` and the app |

---

## 12. Success metrics

- **Deflection:** share of contact-form starts that came *from* a help article vs. direct.
- **Zero-result rate** for searches (target: trending down every month).
- **Helpful rate** per article (flag anything under ~60%).
- **Time-to-article** from search focus to article open.
- **Stale articles:** count past 90 days since `lastVerified` (target: 0).

---

## 13. Open decisions

1. Support channel(s) behind `/help/contact`: form only, or email/WhatsApp as well? Ans: Users will get to choose what means they want, we won't default to one channel only.
2. Where does the upstream status banner get its data (manual flag vs. provider status pages)? Ans: in [#7.1]
3. Who owns the 90-day `lastVerified` review? Ans: feature owner as the default, plus an optional owner field in the frontmatter so every article has a name on it. Add a rotating sweep as a safety net. Also make the build warn at about 75 days and only fail at 90, so nobody gets blindsided on release day.
4. When does Swahili start, and which articles go first? Ans: For now articles are English supported only. Shall expand later as we grow
5. Retention window for `support_requests` and `help_feedback`.
6. Whether `/faq` stays as-is, gets trimmed, or links into `/help`. Ans: Pick the best option and go for it, but I'd suggest that `/faq` to stay as-is

*Final note*: Do not create your own text sizes, color, typography and color. Check the existing ones in corresponding pages for it to match. Incase of anything ask me first.