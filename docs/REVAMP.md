# EaziWage Humans
## Page Concept & Implementation Brief

### 1. The objective

Use the existing `/humans` page route to create a page that introduces the people behind EaziWage and helps visitors understand who builds the product, what they contribute, and the humans behind the company.

The page should feel personal without becoming a social network, and professional without reading like a corporate directory.

**Core idea:** Resend’s human-first approach + Next.js’s team organisation, adapted to EaziWage’s existing UI and identity.

### 2. Proposed page structure

#### A. Introduction
- A short, confident headline introducing the people behind EaziWage.
- A brief description of the team and its mission.
- Copy should sound like EaziWage, not generic recruitment marketing.

#### B. The people behind EaziWage
- Present team members using the existing EaziWage component conventions.
- Each profile should include a real photo or approved portrait, name, role, and a concise description of their contribution.
- Where appropriate, include a personal detail, interest, or small fact that makes the person memorable.
- Profiles should feel individual rather than like identical corporate biographies.

#### C. How the team comes together
- Introduce meaningful teams or areas of responsibility when the actual organisation supports them.
- Possible groupings include leadership, engineering, product, operations, and other verified functions.
- Avoid inventing departments or forcing a small team into a large-company organisational structure.
- If team members hold multiple responsibilities, represent that accurately.

#### D. Beyond the job title
- Where team members are comfortable sharing, include selected interests, side projects, technical contributions, writing, or other relevant work.
- Link to public profiles or published work only when verified and approved.
- This section should add personality and context, not become a collection of unnecessary social links.

#### E. A natural next step
- Close with a concise invitation to explore EaziWage’s Culture or Careers pages.
- Culture should continue explaining how the company works and what it values.
- Careers should remain the destination for available opportunities and applications.
- The Humans page should not duplicate either page.

### 3. Profile interaction

Each person should have a clear, useful profile presentation.

Potential details:
- Name and current role.
- What they work on or contribute to.
- A short biography.
- Personal interests, if voluntarily provided.
- Relevant public links or contributions, where available.

A dedicated profile route may be considered later if there is enough meaningful information to justify it. The initial version should not require a separate page for every person.

### 4. Functionality

- Search people by name, role, or relevant team.
- Provide team filters only if the size and structure of the team justify them.
- Make profile links, if used, keyboard-accessible and clearly labelled.
- Ensure the experience works on mobile, desktop, touch devices, and with assistive technologies.
- Support reduced-motion preferences and avoid making animations necessary to understand profiles.
- Keep the page useful even when optional profile details are unavailable.

Search and filtering are optional for the first release. For a small team, a well-organised directory may be more useful than unnecessary controls.

### 5. Existing EaziWage UI and components

- Preserve the existing EaziWage UI, layout conventions, typography, components, and interaction patterns.
- Reuse existing components where they genuinely fit.
- Avoid introducing a parallel design system or rebuilding existing functionality without a reason.
- Keep motion purposeful and restrained.
- Do not add TiltCard or FloatingOrb merely for decoration. Use existing components only where they support the experience.
- Respect reduced-motion preferences across all movement and animation.

The page should feel like a natural part of EaziWage, not a separate microsite.

### 6. Content and accuracy

- Use verified names, roles, responsibilities, and approved profile information.
- Do not invent biographies, personal interests, team sizes, locations, or achievements.
- Obtain consent before publishing personal details or photographs that team members have not already approved for this purpose.
- Keep profiles easy to update as the team changes.
- Consider acknowledging former team members in a later iteration, once there is a clear reason and an agreed approach.

### 7. What to learn from each reference

**From Resend**
- Make the people the focus rather than presenting a conventional company introduction.
- Give each person a distinct identity.
- Make the page feel personal and approachable.
- Consider former team members and individual contributions as the company grows.

**From Next.js**
- Organise people by real responsibilities where useful.
- Make professional roles and technical contributions easy to understand.
- Link to relevant public work and profiles.
- Keep the directory straightforward to navigate.

**What EaziWage should do differently**
- Combine personality with clarity.
- Reflect the reality of a small, growing team.
- Avoid copying either reference's layout or adding features that the team cannot maintain.
- Make every profile contribute something meaningful to the visitor's understanding of EaziWage.

### 8. Scope boundaries

The initial release should prioritise:
1. The introduction and team directory.
2. Accurate individual profiles.
3. A clear representation of responsibilities.
4. Responsive and accessible interactions.
5. Connections to Culture and Careers.

Defer elaborate profile pages, activity feeds, contribution timelines, clubs, and other community features until there is enough real content and a demonstrated need.

### 9. Acceptance criteria

- [x] The page clearly distinguishes Humans from Culture and Careers.
- [x] Every published profile contains verified information.
- [x] People and responsibilities are easy to understand.
- [x] The page uses the existing EaziWage UI and component conventions.
- [x] Interactions work with keyboard, touch, and assistive technology.
- [x] Reduced-motion preferences are respected.
- [x] No invented team structures, personal details, or achievements are published.
- [x] The initial version remains maintainable as the team grows.
- [ ] Add verified descriptions of each person's contribution beyond their role title.

### Final direction

**Make EaziWage feel like a company made of people, not just a product made by a company.**

Resend provides the human connection. Next.js provides the organisational clarity. EaziWage brings those ideas together through its existing identity, its actual team, and the work those people do.

```tsx
    {/* Stats Row — async server component wrapped in Suspense */}
    <div className="border-t border-slate-100 pt-8">
        <Suspense fallback={<StatsFallback />}>
        <HeroStats />
        </Suspense>
    </div>
```
