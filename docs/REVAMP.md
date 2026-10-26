# EaziWage Blog Experience
## Redesign & Implementation Brief

**Reference points:** Resend Blog, Linear editorial content  
**Primary objective:** Transform `/blogs` from a resource catalogue into a polished, engaging editorial experience while preserving EaziWage's existing UI identity and functionality.

## 1. Core principles

- **Preserve EaziWage's identity.** Use the existing design system, established visual language, component conventions, typography, and colour tokens. Do not introduce a new visual direction.
- **Use references for inspiration, not imitation.** Borrow useful editorial patterns from Resend and Linear without reproducing their layouts.
- **Prioritise content discovery.** Readers should quickly understand what EaziWage publishes, find relevant content, and discover what to read next.
- **Use motion with restraint.** Existing motion components should enhance the experience rather than compete with the content.
- **Respect reduced-motion preferences.** All motion must accommodate users who request reduced animation.
- **Preserve working functionality.** Improve the existing implementation rather than rebuilding working features unnecessarily.

## 2. Proposed page structure

### A. Editorial introduction

Establish the purpose of the EaziWage publication.

Content should communicate the subjects covered, including earned wage access, employee financial wellness, payroll innovation, employer insights, and financial inclusion across African markets.

Keep the introduction focused. Search should remain easy to find without requiring visitors to scroll through an oversized hero.

### B. Featured article

Introduce a dedicated featured-content section.

Requirements:
- Use the existing `isFeatured` field to identify featured content.
- Allow the team to control featured content through the existing data-management workflow.
- Display the article title, summary, publication date, author where available, and cover image where available.
- Provide a clear route to the article.
- Fall back gracefully when no featured article exists.
- Avoid hardcoded articles or duplicate featured entries in the main listing.

The featured section should give the publication an editorial hierarchy rather than presenting every item as equally important.

### C. Content discovery

Retain and improve the existing search and category functionality.

Existing categories:
- All EWA Content
- Implementation Guides
- EWA Insights
- Success Stories
- EWA Events
- EWA Tools

Requirements:
- Keep category selection connected to the existing resources API.
- Ensure search and category filters work together predictably.
- Make the active category and current search query clear.
- Support empty results, failed requests, and retry actions.
- Avoid unnecessary duplicate requests when filters and search change.
- Preserve deduplication and sensible publication-date ordering.
- Ensure the listing remains usable on mobile and with keyboard navigation.

### D. Latest content

Present recent content in a clear, browsable sequence.

Each content item should expose the information needed to decide whether it is worth opening:
- Title
- Concise description
- Content category
- Publication date
- Reading time, where meaningful
- Author or source, where available
- Cover image, where available
- Relevant tags, where useful

Do not assume every item is a conventional article. Guides, case studies, webinars, and downloadable resources may need different metadata and actions.

Featured content should not appear twice in the listing unless there is a deliberate reason.

### E. Related reading

Where the available content supports it, help readers discover related material through shared topics, categories, or tags.

Do not invent relationships or display empty recommendation sections when relevant content is unavailable.

### F. Newsletter subscription

Retain the existing subscription flow and its success and error states.

Improve its contextual role: subscription should feel like a natural continuation for readers who want future insights, not a competing interruption to the main content.

Preserve the current API integration, submission handling, and honeypot protection.

## 3. Existing EaziWage components

Reuse existing components and conventions wherever appropriate.

### TiltCard / existing tilt-card implementation

Use the existing card interaction selectively.

- Avoid applying tilt effects to every content item by default.
- Keep interactions subtle and purposeful.
- Ensure cards remain easy to read, navigate, and interact with.
- Avoid making hover or pointer movement necessary to understand content.
- Ensure touch devices have an equivalent, usable experience without hover-dependent behaviour.

If the existing component has a different exported name, use the actual implementation rather than introducing a duplicate.

### FloatingOrb

Retain `FloatingOrb` as an existing EaziWage visual element, but use it sparingly.

- Avoid excessive instances or competing animated background elements.
- Keep decorative motion subordinate to the content.
- Ensure background elements do not interfere with pointer interaction, text selection, or accessibility.
- Respect reduced-motion preferences.

Do not create new decorative components merely to make the page appear more animated.

### Existing motion conventions

Review the current Framer Motion implementation and preserve useful existing patterns. Remove redundant motion rather than stacking more animation onto the page.

## 4. Reduced-motion requirements

Support `prefers-reduced-motion` throughout the page, not just in isolated components.

When reduced motion is enabled:
- Disable or substantially reduce decorative animations.
- Disable tilt, parallax, and scroll-linked movement where they create unnecessary motion.
- Avoid animated entrances, large transforms, and continuously moving background elements.
- Keep state changes and loading feedback understandable without animation.
- Preserve all functionality and content visibility.

Use the existing motion utilities or Framer Motion's reduced-motion support where appropriate. Do not duplicate motion-preference logic across components unnecessarily.

The page must remain fully usable whether motion is enabled or reduced.

## 5. Data and functionality audit

The existing implementation already has several useful foundations:
- Server-side initial resource fetching.
- A resources API backed by Supabase.
- Featured-content metadata.
- Search and category filtering.
- Realtime refresh support.
- Loading, empty, error, and retry states.
- Newsletter subscription.
- Resource deduplication.

Audit these before changing the architecture.

Specifically verify:

1. **Featured content:** `isFeatured` is currently available in the API response but needs to drive the proposed featured section.
2. **Fetching:** Review the initial server fetch and subsequent client fetches to avoid redundant requests and unnecessary loading transitions.
3. **Realtime refresh:** Verify that new content refreshes the appropriate sections without disrupting active search or category selections.
4. **Search fallback:** Review the NewsAPI fallback and ensure external results are clearly distinguishable from EaziWage-authored content where necessary.
5. **Reading time:** Do not present estimates derived only from a short article description as though they represent the full article's actual reading time.
6. **Destinations:** Verify every content link and determine whether EaziWage-authored articles need dedicated internal detail pages. Preserve valid external destinations for third-party resources.
7. **Content quality:** Check for stale entries, duplicate links, missing metadata, broken images, and incorrectly classified resources.
8. **SEO:** Preserve metadata and indexing requirements. Where internal article pages exist or are introduced, ensure their metadata and canonical URLs are handled appropriately.

All code and database work must remain within the existing read-only inspection boundary until changes are explicitly authorised.

## 6. Accessibility and responsive behaviour

- Use semantic page landmarks and a logical heading hierarchy.
- Provide accessible labels for search and interactive controls.
- Support keyboard navigation and visible focus states.
- Ensure card links and category controls have clear accessible names.
- Avoid conveying important information through colour alone.
- Provide meaningful image alternative text.
- Respect reduced-motion preferences.
- Ensure the content hierarchy remains clear on narrow screens.
- Prevent sticky navigation or other persistent elements from obstructing focused content.
- Ensure loading, empty, error, and subscription states are announced appropriately when needed.

## 7. Implementation boundaries

Do not:
- Replace the established EaziWage design system.
- Introduce new brand colours or override existing colour conventions.
- Rebuild working search, subscription, or API functionality without a demonstrated need.
- Add animations merely for visual novelty.
- Hardcode featured articles or manually duplicate content.
- Add database migrations, modify records, or change schemas as part of this documentation exercise.
- Introduce new dependencies when existing components or utilities already solve the problem.

Prefer small, understandable changes that improve the experience without adding unnecessary complexity.

## 8. Acceptance criteria

The redesign is ready for review when:

- [ ] The page has a clear editorial identity.
- [ ] Featured content is driven by existing data.
- [ ] Featured content and the main listing avoid unintended duplication.
- [ ] Search and category filters work together correctly.
- [ ] Loading, empty, error, and retry states behave reliably.
- [ ] The existing EaziWage UI identity is preserved.
- [ ] TiltCard and FloatingOrb are used selectively.
- [ ] Reduced-motion preferences are respected throughout the experience.
- [ ] Desktop, mobile, keyboard, and touch interactions work correctly.
- [ ] Newsletter subscription and realtime refresh remain functional.
- [ ] Article destinations, metadata, and content freshness have been verified.
- [ ] No database or repository changes occur without explicit authorisation.

## Final direction

The goal is not to make the blog louder. It is to make it more intentional.

Take the editorial clarity of Resend(`https://resend.com/blog`), the contextual storytelling of Linear(`https://linear.app/now`), and EaziWage's existing component language. Give featured content a purpose, make discovery effortless, respect accessibility, and let the quality of the content lead the experience.