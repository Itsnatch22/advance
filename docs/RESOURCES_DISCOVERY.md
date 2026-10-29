# Resources discovery

Supabase remains the source of truth for published EaziWage resources. The API
keeps its `{ resources, total }` response and supplements curated results with
external articles only when the search is non-empty or the first-party result
count is below the configured threshold. Webinar and download filters are
first-party only because news article metadata cannot substantiate those
resource types.

## Provider and content policy

External discovery uses the [GDELT DOC 2.0 article-list API](https://blog.gdeltproject.org/gdelt-doc-2-0-api-debuts/). Its public API
supports full-text phrase and Boolean queries, global news coverage including
machine-translated coverage, and a rolling three-month search period. The
implementation uses one bounded request per eligible API request, asks
Next.js's Data Cache to revalidate provider responses after ten minutes, and
keeps the public API response `no-store`. No provider API key is required.

The previous NewsAPI integration only ran for an empty database search, used a
30-day cutoff, and coupled user terms to a category expression. NewsAPI's
official [pricing page](https://newsapi.org/pricing) says its Developer plan is
restricted to development and testing, not production. GDELT is selected for unauthenticated, broad,
regionally useful discovery without introducing a production credential or
paid-plan dependency. It is an index of news coverage, not an evergreen
research catalog; older evergreen guides remain best sourced from curated
first-party content. Its DOC API currently searches a rolling three-month
window. The provider may be unavailable or may return no matching article.

Only article metadata is displayed, with a link to the original publisher.
Missing descriptions and dates are left blank rather than inferred from the
title or GDELT's observation timestamp. Provider article images are not
displayed because their reuse rights are not verified. Provider URLs must use
HTTP or HTTPS. Exact canonical URLs and sufficiently long exact title matches
are deduplicated, with the first-party record retained. Supabase's
featured/date ordering is retained; external discovery results follow it in
GDELT's relevance order. External items are never marked featured.

GDELT's [terms of use](https://www.gdeltproject.org/about.html) permit
commercial use of its data and ask redistribution to include a citation and
link to GDELT. The Resources UI therefore identifies
GDELT as the discovery source while retaining publisher attribution and the
original article link. The GDELT project does not grant rights to republish
article text or images; only metadata is used and no article body is fetched.

## Reliability and configuration

External fetches have a six-second timeout and use the Next.js Data Cache with
a ten-minute revalidation period. The response itself remains private and
uncached. Provider errors are logged without search terms or credentials and
return valid database resources with a `discoveryUnavailable` flag; Supabase
errors return HTTP 503 rather than appearing as successful empty results.

Optional server environment variables:

| Variable                             | Default | Purpose                                                                              |
| ------------------------------------ | ------: | ------------------------------------------------------------------------------------ |
| `RESOURCE_DISCOVERY_ENABLED`         |  `true` | Set to `false` to disable external requests.                                         |
| `RESOURCE_DISCOVERY_LIMIT`           |    `12` | Maximum external results (clamped to 1–30).                                          |
| `RESOURCE_DISCOVERY_MIN_FIRST_PARTY` |     `6` | Discover without search only below this first-party result count (clamped to 0–100). |

User search terms are limited to 120 characters, stripped of provider query
operators, and treated as individually quoted terms combined with AND.
Category-specific external
classification requires explicit title evidence. Ambiguous uses of “EWA”
alone are not considered relevant.

The `blogs` table schema is not defined in the repository migrations, so its
full-text index and publication rules could not be independently verified
against a checked-in schema. Existing `is_published`, category, FTS, and
featured ordering behavior is preserved.

## Known limitations

- GDELT's DOC API is best-effort, global news coverage with a three-month
  rolling window; it is not a guaranteed editorial or evergreen catalog.
- Articles may not contain enough metadata to provide a description, image, or
  publication date. Those fields remain empty instead of being fabricated.
- Search results are relevance-ordered by GDELT; curated EaziWage resources
  are always kept first, with featured records preserving their database
  order.
- Deployment must allow outbound HTTPS requests to `api.gdeltproject.org`.
