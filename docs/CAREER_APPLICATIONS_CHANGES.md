# Career Applications Feature Implementation - Change Summary

## Overview
Implemented internal job applications feature replacing mailto-only apply flow with form-based submissions to Supabase. All database schema changes are already live.

## Files Changed/Created

### Updated Files

1. **`app/careers/types.ts`** — Added `slug` to Career type; changed `getApplyHref` logic
   - Added `slug: string` field to Career type
   - Replaced `getApplyHref(career: Pick<Career, "apply_link" | "apply_email" | "title">)`
   - New: `getApplyHref(career: Pick<Career, "apply_link" | "slug">)` returns `/careers/${slug}/apply` when `apply_link` is null (internal route, not mailto)

2. **`app/careers/page.tsx`** — Updated query to select `slug`
   - Changed `.select()` to include `slug` field in query
   - No other logic changes needed

3. **`app/careers/[slug]/page.tsx`** (renamed from `[id]`) — Updated to route by slug instead of id
   - Renamed directory from `[id]` to `[slug]`
   - Changed `params: Promise<{ id: string }>` → `params: Promise<{ slug: string }>`
   - Updated `getCareer()` to query `.eq("slug", slug)` instead of `.eq("id", id)`
   - Updated query to select `slug` field
   - Updated metadata generation to use `career.slug` in URL

4. **`app/careers/CareersListClient.tsx`** — Updated links to use `slug` instead of `id`
   - Changed `href={/careers/${career.id}}` → `href={/careers/${career.slug}}` (2 occurrences: title link and "View role" button)

### New Files Created

5. **`app/careers/[slug]/apply/page.tsx`** — Main apply page component
   - Server component that fetches career by slug
   - Validates that career is open before showing form; displays closed/archived message if `is_open = false`
   - Shows "Back to role" link and application form wrapper
   - Metadata includes apply-specific title/description

6. **`app/careers/[slug]/apply/ApplicationForm.tsx`** — Form component (use client)
   - Collects: full_name*, email*, phone, resume (PDF/Word)*, cover_letter, linkedin_url, portfolio_url, consent*
   - Resume upload:
     - Validates file type (PDF, .doc, .docx) and max 5MB size
     - Uploads to Supabase Storage bucket `career-applications` with generated filename
     - Returns public URL for storage
   - On submit:
     - Validates required fields (full_name, email, resume, consent checkbox)
     - Uploads resume to storage if provided
     - Inserts into `career_applications` with:
       - `career_id`: resolved ID from server fetch
       - `career_title_snapshot`: careerTitle (captured at submission time)
       - `career_slug_snapshot`: careerSlug (captured at submission time)
       - `full_name, email, phone, resume_url, cover_letter, linkedin_url, portfolio_url`
       - `status: "submitted"`
       - `consent: true`
       - `consent_given_at`: current timestamp (ISO format)
     - Shows success state with thank you message on success
     - Displays error messages with retry option on failure

## Final getApplyHref Logic

```typescript
export function getApplyHref(
  career: Pick<Career, "apply_link" | "slug">
) {
  if (career.apply_link) {
    return career.apply_link;
  }
  return `/careers/${career.slug}/apply`;
}
```

**Key change:** When `apply_link` is null, routes to internal `/careers/${slug}/apply` instead of generating a mailto: link.

## career_applications Insert Call

```typescript
const { error: insertError } = await supabase
  .from("career_applications")
  .insert([
    {
      career_id: careerId,
      career_title_snapshot: careerTitle,
      career_slug_snapshot: careerSlug,
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone || null,
      resume_url: resumeUrl,
      cover_letter: formData.cover_letter || null,
      linkedin_url: formData.linkedin_url || null,
      portfolio_url: formData.portfolio_url || null,
      status: "submitted",
      consent: true,
      consent_given_at: new Date().toISOString(),
    },
  ]);
```

## Routing Changes

### Before
- Detail page: `/careers/[id]/page.tsx` → `/careers/:id` (queried by `id`)
- Apply flow: Null `apply_link` → `mailto:apply_email?subject=...`

### After
- Detail page: `/careers/[slug]/page.tsx` → `/careers/:slug` (queried by `slug`)
- Apply form: `/careers/[slug]/apply/page.tsx` → `/careers/:slug/apply` (internal route, form-based)
- External apply: `apply_link IS NOT NULL` → redirects to `apply_link` (external URL)

## Resume Upload Pattern

Uses Supabase Storage `career-applications` bucket (consistent with partner_applications pattern):
- File path: `career-applications/{filename}`
- Filename format: `resume_{timestamp}_{random}.{ext}` to avoid collisions
- Public URL stored in `resume_url` column
- Validation: PDF or Word docs only, max 5MB

## Closed Role Handling

If `is_open = false` when accessing `/careers/[slug]/apply`:
- Shows "This role is no longer accepting applications" message
- Provides link back to careers list
- No form is rendered

## Out of Scope (Not Implemented)
- Admin view for reviewing applications
- Salary display, country/work_mode filtering, search modifications
- Real job or applicant data
- Email notifications on application submission

## Places Flagged But Not Changed
None identified — all career routing and queries now use `slug` instead of `id`.

## RLS Enforcement
- `career_applications` table has RLS: anon/authenticated can only INSERT
- No candidate can SELECT/UPDATE/DELETE their own applications
- Only service_role can access full application data (admin view built later)
