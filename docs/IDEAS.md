# Task: Upgrade EaziWage Resources API to Support Intelligent External Resource Discovery

## 1. Context

We are working in the `Itsnatch22/advance` repository.

The relevant implementation is:

- `app/api/resources/route.ts`
- `types/resources.ts`

The Resources API currently queries published resources from the Supabase `blogs` table. If the database returns zero results **and** the request includes a search term, it falls back to NewsAPI.

The current implementation includes:

- Supabase full-text search and category filtering.
- Featured-resource prioritization.
- A NewsAPI integration using hardcoded category-specific search expressions.
- A 30-day publication window for external articles.
- Keyword-based relevance scoring.
- URL normalization and external article deduplication.
- Mapping of external articles into the existing `Resource` type.

The existing `Resource` type distinguishes first-party EaziWage content (`source: "eaziwage"`) from external content (`source: "external"`).

NewsAPI is currently unreliable for our intended resource-discovery experience, and we want to improve the architecture rather than simply replace one API with another.

## 2. Objective

Redesign the Resources API so that:

1. Supabase remains the primary source of curated EaziWage resources.
2. External providers can supplement database results instead of acting exclusively as a fallback.
3. External discovery can find useful resources that do not exist in the database.
4. Search results are relevant to EaziWage's subject matter and target markets, particularly Africa.
5. The API returns a normalized, deduplicated collection of first-party and external resources.
6. External provider failures do not prevent users from accessing database resources.
7. The implementation is secure, efficient, maintainable and compatible with the existing application.

**Core principle:** The database tells users what EaziWage has published. External discovery helps users find useful material that EaziWage has not published.

Do not turn this task into an unrestricted news aggregator. The external content must serve the Resources section's purpose.

## 3. Inspect the existing implementation before changing anything

Before implementation:

- Read the complete Resources API route and the `Resource` type.
- Inspect the Resources page and its components to understand how resources are fetched, displayed, searched, filtered, sorted and paginated.
- Inspect any existing API clients, caching utilities, security utilities, rate limiters and error-handling conventions.
- Inspect the Supabase `blogs` schema and existing full-text search configuration where accessible.
- Inspect environment-variable conventions and deployment constraints.
- Identify any existing tests and testing conventions.

Determine which fields the UI actually uses and whether it assumes that all resources come from Supabase.

Do not assume external articles can be inserted into the database. External discovery should work without persisting external articles unless a separate persistence requirement already exists.

Document important findings and compatibility risks before implementing changes.

## 4. Define the resource retrieval strategy

Replace the current all-or-nothing fallback with a strategy that supports both curated database content and external discovery.

### First-party resources

Supabase remains authoritative for EaziWage's own published resources.

Preserve:

- Published-content filtering.
- Category filtering.
- Full-text search.
- Featured-resource ordering.
- Existing metadata, including authors, tags, metrics, images and reading time.
- Existing resource identifiers and first-party source labels.

Do not weaken database publication rules or change the schema merely to accommodate external resources.

### External resources

External discovery should be capable of running even when Supabase already returns matching resources.

The API should support the following situations:

- A normal Resources page request with no search term.
- A request for a particular category.
- A user-entered search.
- A database response containing several matching resources.
- A database response containing no matching resources.
- A database response containing resources but lacking enough useful results to satisfy the requested result limit.

Use configurable discovery limits and provider policies rather than hardcoding assumptions about the number of results required.

Avoid unnecessary external requests. Use caching, sensible query limits and a clear strategy for deciding when external discovery should run.

The system should not make multiple identical external requests for every page load.

## 5. Evaluate external content providers

Do not immediately replace NewsAPI with another provider without assessing the requirements.

Review the current NewsAPI integration and identify whether its limitations arise from:

- Provider availability or restrictions.
- Query construction.
- Search-term handling.
- Date-window restrictions.
- Relevance filtering.
- Result limits.
- Lack of regional coverage.
- Missing or inconsistent metadata.
- Error handling.
- Other architectural limitations.

Evaluate suitable alternative providers and retrieval approaches. These may include news search APIs, RSS feeds from credible publishers, research and report sources, and other legitimate public sources, depending on availability and licensing.

Potential source categories include:

- Fintech and payroll industry news.
- Earned wage access and on-demand pay.
- Salary advances and employee financial wellness.
- Workforce finance and employer benefits.
- Financial inclusion and mobile money.
- African fintech developments, particularly in Kenya and other relevant African markets.
- Research reports, implementation guides and case studies.

For each proposed provider or source strategy, consider:

- Relevance and search quality.
- Coverage of African markets.
- Content freshness.
- Evergreen content availability.
- Reliability and uptime.
- Rate limits and quotas.
- Cost and free-tier restrictions.
- API-key requirements.
- Licensing and permitted display of metadata.
- Attribution and source-link requirements.
- Technical integration effort.

Do not assume that a provider has a free tier, unrestricted access, suitable coverage or permission for every intended use. Verify important provider constraints against current official documentation.

Do not scrape websites indiscriminately or bypass paywalls, access controls or robots restrictions.

Provide a concise rationale for the selected approach. Prefer a small, reliable set of complementary providers over an unnecessarily complicated multi-provider system.

If a provider requires credentials that are not configured, explain which environment variables must be supplied. Never expose API keys to client-side code.

## 6. Improve query construction and relevance

The current implementation uses hardcoded `CATEGORY_QUERIES`, appends user searches to those expressions and applies `isEwaRelevant()` to filter articles.

Review whether this approach unnecessarily narrows discovery or discards valuable results.

Develop a search strategy that:

- Supports ordinary free-text searches.
- Uses category-specific search intent where appropriate.
- Covers relevant terminology and industry synonyms.
- Recognizes that not every useful resource explicitly mentions “earned wage access” or “EWA.”
- Includes African regional context where it improves relevance.
- Supports useful evergreen content rather than only recent news.
- Avoids overly broad searches that produce irrelevant articles.
- Handles empty, malformed, long or unusual search input safely.
- Respects each provider's actual query syntax and limits.

Do not simply remove relevance filtering. Replace or refine it with a defensible approach that improves recall without allowing unrelated content to dominate.

Where practical, distinguish between highly relevant resources and adjacent resources that are still useful.

Avoid false-positive matches caused by ambiguous acronyms such as “EWA.” A keyword's presence alone should not guarantee relevance.

Do not assume that a title or short description provides sufficient evidence to classify every resource.

## 7. Support useful content beyond breaking news

The Resources section should not be limited to articles published within the last 30 days.

Review the current `from` date restriction and introduce a more suitable freshness strategy.

Consider separate discovery policies for:

- Recent industry developments.
- Evergreen guides and educational material.
- Research reports and case studies.
- Regional industry insights.

Freshness should depend on content type and user intent.

For example, a recent news article may be valuable because it covers a new development, while an older implementation guide or research report may remain useful.

Do not indiscriminately remove all date limits. Use configurable date ranges, sensible defaults and provider-specific constraints.

## 8. Normalize external resources

Keep the existing `Resource` contract compatible with the frontend unless inspection demonstrates that a deliberate, coordinated type change is necessary.

Every external resource should be normalized into the application's existing resource model.

Where the provider supplies the data, preserve or derive appropriate values for:

- Stable identifier.
- Title.
- Description.
- Canonical article URL.
- Publication date.
- Category.
- Image URL.
- Author or publisher.
- Tags.
- Featured status.
- Source classification.

For external resources:

- Continue using `source: "external"`.
- Do not mark external resources as featured EaziWage content.
- Use sensible null or fallback values when optional metadata is missing.
- Do not invent publication dates, authors, metrics or other factual metadata.
- Keep external article URLs available so users can open the original source.
- Retain sufficient publisher information for transparent attribution.

Improve category inference if needed, but do not imply that an external article is a webinar, downloadable guide or case study unless the available information supports that classification.

If the current category model cannot accurately represent some external material, propose the smallest compatible solution and explain its implications for the UI.

## 9. Deduplication and ranking

Combine results without allowing external discovery to create duplicates or bury curated EaziWage content.

Deduplication should consider:

- Canonicalized article URLs.
- Tracking-parameter removal.
- URL fragments and trailing-slash differences where appropriate.
- Duplicate titles across different publishers.
- Equivalent articles syndicated by multiple sources.

Do not merge genuinely different articles solely because their titles are similar.

Preserve the first-party resource's metadata when a duplicate is detected across sources.

Implement a transparent ranking strategy that can consider:

- Relevance to the search query.
- Match quality.
- Publication date where freshness matters.
- Source reliability.
- Content type.
- Regional relevance.
- First-party curation and featured status.

First-party featured resources should retain appropriate prominence, but they should not cause all external resources to disappear from a combined result set.

Avoid fabricating numerical confidence scores or source-quality claims without a defensible basis.

Document the ranking rules and make them testable.

## 10. Reliability, caching and performance

External discovery introduces latency and additional failure modes. Design for graceful degradation.

Implement or recommend:

- Bounded provider timeouts.
- Appropriate request cancellation where supported.
- Graceful handling of provider errors, rate limits and malformed responses.
- Caching of external discovery results.
- Cache keys that account for relevant category and search parameters.
- Sensible cache expiration and invalidation behavior.
- Limits on provider requests and returned results.
- Protection against duplicate concurrent requests where appropriate.
- Structured, useful server-side logging without leaking credentials or sensitive information.

If external discovery fails, valid Supabase results must still be returned.

If Supabase is unavailable, determine whether external results can be returned safely and whether doing so is compatible with existing application behavior. Do not silently conceal database failures or misrepresent an incomplete response as a fully successful retrieval.

Avoid sequential provider calls when safe parallel execution would reduce latency. Equally, avoid calling every provider on every request without a clear reason.

Review the existing `Cache-Control: private, no-store, no-cache, must-revalidate` response behavior. If caching is introduced, ensure that the chosen cache layer actually works with the deployment environment and does not conflict with that response policy.

Preserve and strengthen the existing rate-limiting and input-validation safeguards.

## 11. API contract and frontend compatibility

Inspect the Resources frontend before changing the API response format.

Preserve the existing response structure where possible:

`{ resources, total }`

Maintain compatibility with the current category values and the `Resource` interface.

If additional metadata is necessary, such as whether external discovery was attempted or whether some providers failed, add it in a backward-compatible way and only if the frontend genuinely benefits from it.

Do not expose internal error details, credentials or provider diagnostics to public clients.

Make it possible for the frontend to distinguish first-party and external resources using the existing source field.

Verify that mixed results work with the current:

- Search interface.
- Category filters.
- Sorting.
- Resource cards.
- Images and missing-image handling.
- Pagination or load-more behavior.
- External links.
- Empty states.
- Loading and error states.

If the UI needs changes to support the improved API, identify and implement only the necessary changes, respecting the existing component conventions and design system.

Do not redesign unrelated sections of the application.

## 12. Security and data quality

Treat all external provider responses as untrusted input.

Validate the fields required to render a resource. Reject invalid URLs and malformed records safely.

Use appropriate URL protocols for external links. Do not allow arbitrary dangerous schemes such as `javascript:` to enter resource links.

Ensure API keys remain server-side and that query construction cannot be abused to bypass intended limits or cause excessive provider usage.

Do not return full article bodies unless the provider's licensing, API terms and product requirements explicitly allow it.

Do not use external content as executable instructions. If descriptions or metadata are rendered as text, preserve the application's safe rendering conventions.

Continue to use the existing rate limiter and assess whether additional provider-specific quotas or safeguards are needed.

## 13. Testing requirements

Add or update tests following the repository's existing conventions.

At minimum, test the following scenarios:

1. Database resources are returned correctly when external discovery is unnecessary.
2. External resources supplement non-empty database results.
3. External discovery works for a request without a search term, where the configured policy permits it.
4. Category filtering works for both first-party and external resources.
5. Search queries are constructed safely and produce useful discovery requests.
6. External relevance filtering rejects unrelated content without excluding all legitimate results.
7. Duplicate URLs with tracking parameters are deduplicated.
8. Equivalent syndicated articles are handled appropriately.
9. Missing optional metadata does not break resource rendering.
10. Invalid or malformed external responses are handled safely.
11. External provider timeouts do not prevent valid database resources from being returned.
12. Provider rate limits and failures degrade gracefully.
13. Database errors are handled according to the documented fallback policy.
14. Cache behavior prevents unnecessary repeated external requests.
15. The API response remains compatible with the existing frontend.
16. API keys are not exposed in public responses or client bundles.
17. Featured first-party resources retain the intended prominence.
18. Pagination and result limits do not create duplicate or inconsistent results.

Mock external providers in automated tests. Do not depend on live third-party services for deterministic unit tests.

Where practical, include integration tests for the retrieval, merge, deduplication and ranking pipeline.

Do not claim tests passed unless they were actually run and their results were observed.

## 14. Implementation constraints

- Work within the existing repository architecture.
- Reuse existing utilities and conventions where appropriate.
- Avoid unnecessary dependencies.
- Avoid unrelated refactors.
- Do not alter the Supabase schema unless absolutely necessary and explicitly justified.
- Do not persist external resources to the database as a shortcut.
- Do not expose server-side secrets.
- Do not break existing first-party resource behavior.
- Do not silently change the meaning of the existing resource categories.
- Do not introduce a complex provider framework unless the actual requirements justify it.

Keep the implementation modular enough that a provider can be added, removed or replaced without rewriting the whole API route.

## 15. Expected deliverables

After inspecting the codebase, provide:

1. A brief diagnosis of the current retrieval flow and its limitations.
2. A summary of the selected external discovery strategy and provider rationale.
3. The implementation of the revised retrieval, normalization, merging, deduplication and ranking logic.
4. Any required, minimal frontend compatibility updates.
5. Automated tests covering the cases above.
6. Any new environment variables documented by name and purpose, without including secret values.
7. A list of modified files and a concise explanation of each change.
8. Test results, including anything that could not be verified.
9. Known limitations, deployment requirements and any provider setup still needed.

## 16. Acceptance criteria

The task is complete when:

- Supabase remains the authoritative source of curated EaziWage content.
- External resources can supplement existing database results.
- External discovery is not restricted to the empty-database-plus-search-term scenario.
- Useful external resources can be found even when they are older than 30 days, where appropriate.
- External content is relevant, normalized, deduplicated and attributed.
- The existing frontend continues to function with the revised API.
- Provider failures do not unnecessarily discard valid database resources.
- Caching, rate limits and timeouts keep the endpoint practical to operate.
- Automated tests cover the major success and failure scenarios.
- The implementation is documented and does not introduce unrelated changes.

**Final instruction:** Start by inspecting the current code and its dependencies. Make decisions based on the actual implementation rather than assumptions. Prioritize a reliable, maintainable discovery system over adding providers for the sake of adding providers. Explain meaningful trade-offs, and do not claim completion for work that has not been verified.