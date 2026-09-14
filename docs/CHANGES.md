You are implementing a set of careers-feature improvements identified in a codebase audit (Next.js App Router, Supabase, TypeScript). Work through these in the order given — later items depend on earlier ones.

1. SERVER-SIDE APPLICATION SUBMISSION (highest priority)
   - Create app/api/careers/[slug]/applications/route.ts.
   - Define ONE zod schema for the application payload, in a shared location both this route and the client form import — do not let the client-side form validation and the server validation be two separately maintained schemas that can drift apart.
   - The route resolves career_id, career_title_snapshot, and career_slug_snapshot itself by looking up the career via slug — never trust these fields if the client sends them. Reject the request if the client payload includes them.
   - Verify the career exists and status = 'open' before accepting a submission. Reject with a clear error otherwise (not a silent failure).
   - Add a dedicated careerApplicationLimiter rate limiter (do not reuse a generic one).
   - Move resume upload to a signed-upload-URL pattern or fully server-mediated upload — the client should not freely name or place storage objects.
   - Set consent and consent_given_at together in the same server-side write.
   - Update ApplicationForm.tsx to POST to this route instead of inserting into Supabase directly from the browser.

2. ROUTE-LEVEL LOADING/ERROR BOUNDARIES
   - Add app/careers/[slug]/loading.tsx, app/careers/[slug]/error.tsx, app/careers/[slug]/apply/loading.tsx, app/careers/[slug]/apply/error.tsx.
   - Loading skeletons should match final layout shape, not a generic spinner.
   - Error boundaries should offer a retry action and not take down the rest of the careers section.

3. CAREERS ADMIN REVIEW FLOW
   - BEFORE building this: check whether an authenticated admin system already exists elsewhere in the codebase (auth guard, session/role check). If none exists, stop and flag this back — admin auth is a prerequisite, not something to improvise inline for this feature alone.
   - If admin auth exists: add an authenticated page listing career_applications with filters by role, status, submission date, and candidate search.
   - Status transitions: submitted → under_review → shortlisted → rejected/hired (matching the existing DB enum exactly — do not invent new status names).
   - Every status change must log actor (the authenticated admin's identity), timestamp, old status, and new status.
   - Resumes must be accessed via signed URLs, never a public storage URL.

4. APPLICATION FORM ERGONOMICS
   - Use react-hook-form with the SAME shared zod schema from step 1 as the resolver — not a second schema.
   - Extract reusable FormField, FileUploadField, and ConsentCheckbox components.
   - Inline, per-field errors, not one global error message.
   - Show allowed file type/size helper text before file selection, not just on rejection.
   - Keyboard-only completion must work end to end; screen readers must announce validation errors next to their field.

5. CANDIDATE CONFIRMATION + INTERNAL NOTIFICATION EMAIL
   - Trigger both emails only after the server-side insert in step 1 succeeds.
   - The internal notification recipient is the submitting career's own apply_email column (per-role), NOT a single hardcoded team inbox — confirm this by reading apply_email from the resolved career record.
   - Email failure must never roll back the application insert — log the failure with enough context to debug, but the application record stands regardless.

6. JOBPOSTING JSON-LD STRUCTURED DATA
   - Add JobPosting schema to app/careers/[slug]/page.tsx for status = 'open' roles only.
   - For work_mode = 'remote' roles (which have country_code = NULL by design), use jobLocationType: "TELECOMMUTE" — do NOT fabricate a jobLocation for these, and do not skip structured data for them either.
   - For onsite/hybrid roles, populate jobLocation from city + country_code.
   - Include salary fields only when salary_min/salary_max/currency_code are all present; omit the salary block entirely otherwise, don't emit nulls into the schema.
   - Closed/archived roles: omit JobPosting entirely rather than emitting stale/invalid structured data.

7. REMOVE DECORATIVE MOTION FROM FORM-HEAVY PAGES
   - Remove FloatingOrb (or equivalent decorative background motion) from the career detail and apply pages specifically.
   - Keep it on marketing/storytelling pages — this is scoped to application-adjacent pages only.
   - Application pages should pass a reduced-motion review: no animated background competing with field focus or error states.

8. TESTS
   - Unit test formatLocation, formatSalary, formatDepartment, and getApplyHref (or its replacement from the internal/external apply logic).
   - Route handler tests for the new server-side application endpoint, including: invalid file type, oversized file, closed/archived role rejected, missing consent rejected, duplicate rapid submission handled by rate limiter.
   - E2E: happy path applying to an open internal role; a role with apply_link set must show external redirect behavior, never internal form UI; a closed or archived role must be blocked from submission at both UI and API layers.

OUT OF SCOPE

- Icon library consolidation, CSP/image domain hardening, env config centralization, and the general design-system notes doc — all real but not careers-specific, handle separately.
- Do not add real applicant or job data.

OUTPUT

- List every file changed or created, grouped by the numbered item above.
- Show the shared zod schema.
- Show the JobPosting JSON-LD output for one remote role and one onsite role, side by side, so the TELECOMMUTE handling is visible.
- Explicitly state whether an existing admin auth system was found for item 3, and what you did as a result.
