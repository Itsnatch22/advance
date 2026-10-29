import { createHash } from "crypto";
import type { Resource, ResourceCategory } from "@/types/resources";

export const RESOURCE_CATEGORIES: readonly ResourceCategory[] = [
  "guide",
  "blog",
  "case-study",
  "webinar",
  "download",
];

const AFRICAN_MARKETS =
  '(Africa OR Kenya OR Nigeria OR Ghana OR Uganda OR Tanzania OR Rwanda OR "South Africa")';
const CORE_TERMS =
  '("earned wage access" OR "on-demand pay" OR "salary advance" OR "wage streaming" OR "employee financial wellness" OR "financial inclusion")';
const TRACKING_PARAMETERS = /^(utm_.+|fbclid|gclid|mc_cid|mc_eid)$/i;

interface GdeltArticle {
  url?: unknown;
  title?: unknown;
  socialimage?: unknown;
  domain?: unknown;
}

interface GdeltResponse {
  articles?: unknown;
}

export interface DiscoveryConfig {
  enabled: boolean;
  limit: number;
  minimumFirstPartyResults: number;
}

function boundedInteger(
  value: string | undefined,
  fallback: number,
  minimum: number,
  maximum: number
): number {
  if (!value || !/^\d+$/.test(value)) return fallback;
  return Math.min(maximum, Math.max(minimum, Number(value)));
}

export function getDiscoveryConfig(
  env: Partial<NodeJS.ProcessEnv> = process.env
): DiscoveryConfig {
  return {
    enabled: env.RESOURCE_DISCOVERY_ENABLED !== "false",
    limit: boundedInteger(env.RESOURCE_DISCOVERY_LIMIT, 12, 1, 30),
    minimumFirstPartyResults: boundedInteger(
      env.RESOURCE_DISCOVERY_MIN_FIRST_PARTY,
      6,
      0,
      100
    ),
  };
}

export function normalizeSearch(search: string): string {
  return search
    .replace(/[\u0000-\u001f\u007f]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isResourceCategory(
  category: string
): category is ResourceCategory {
  return RESOURCE_CATEGORIES.includes(category as ResourceCategory);
}

export function shouldDiscoverResources({
  config,
  category,
  search,
  firstPartyCount,
}: {
  config: DiscoveryConfig;
  category: ResourceCategory | "all";
  search: string;
  firstPartyCount: number;
}): boolean {
  if (!config.enabled || category === "webinar" || category === "download") {
    return false;
  }

  return Boolean(search) || firstPartyCount < config.minimumFirstPartyResults;
}

function safeSearchTerms(search: string): string {
  return search
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

export function buildGdeltQuery(
  category: ResourceCategory | "all",
  search: string
): string | null {
  if (category === "webinar" || category === "download") return null;

  let query = `${CORE_TERMS} AND ${AFRICAN_MARKETS}`;
  if (category === "guide") {
    query = `${CORE_TERMS} AND (guide OR tutorial OR implementation OR "how to") AND ${AFRICAN_MARKETS}`;
  } else if (category === "case-study") {
    query = `${CORE_TERMS} AND ("case study" OR "success story") AND ${AFRICAN_MARKETS}`;
  }

  const terms = safeSearchTerms(search).split(" ").filter(Boolean).slice(0, 12);
  return terms.length
    ? `${query} AND ${terms.map((term) => `"${term}"`).join(" AND ")}`
    : query;
}

export function normalizeArticleUrl(value: string): string | null {
  try {
    const url = new URL(value);
    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      url.username ||
      url.password
    ) {
      return null;
    }

    url.hash = "";
    if (url.hostname.toLowerCase().startsWith("www.")) {
      url.hostname = url.hostname.slice(4);
    }
    for (const key of [...url.searchParams.keys()]) {
      if (TRACKING_PARAMETERS.test(key)) url.searchParams.delete(key);
    }
    url.searchParams.sort();
    url.pathname = url.pathname.replace(/\/+$/, "") || "/";
    return url.toString();
  } catch {
    return null;
  }
}

function normalizedTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function inferCategory(title: string): ResourceCategory {
  const text = title.toLowerCase();
  if (/\b(case study|success story)\b/.test(text)) return "case-study";
  if (/\b(guide|tutorial|how to|how-to|implementation guide)\b/.test(text)) {
    return "guide";
  }
  if (/\b(webinar|conference|summit)\b/.test(text)) return "webinar";
  if (/\b(download|tool|calculator|template)\b/.test(text)) return "download";
  return "blog";
}

function relevanceScore(title: string, domain: string): number {
  const text = `${title} ${domain}`.toLowerCase();
  let score = 0;

  for (const phrase of [
    "earned wage access",
    "on-demand pay",
    "salary advance",
    "wage streaming",
  ]) {
    if (text.includes(phrase)) score += 4;
  }

  for (const phrase of [
    "employee financial wellness",
    "workforce finance",
    "financial inclusion",
    "mobile money",
  ]) {
    if (text.includes(phrase)) score += 2;
  }

  for (const phrase of ["payroll", "fintech", "wages", "salary", "employer"]) {
    if (new RegExp(`\\b${phrase}\\b`).test(text)) score += 1;
  }

  if (
    /\b(kenya|nairobi|nigeria|lagos|ghana|uganda|tanzania|rwanda|ethiopia|africa|south africa)\b/.test(
      text
    )
  ) {
    score += 2;
  }

  if (
    /\bewa\b/.test(text) &&
    /\b(earned|wage|payroll|salary|fintech|employee)\b/.test(text)
  ) {
    score += 3;
  }

  return score;
}

function normalizeArticle(article: GdeltArticle): Resource | null {
  if (typeof article.title !== "string" || typeof article.url !== "string") {
    return null;
  }

  const title = article.title.replace(/\s+/g, " ").trim().slice(0, 300);
  const link = normalizeArticleUrl(article.url);
  if (!title || !link) return null;

  const domain =
    typeof article.domain === "string" && article.domain.length <= 255
      ? article.domain.trim()
      : new URL(link).hostname;
  if (relevanceScore(title, domain) < 3) return null;

  return {
    id: `gdelt-${createHash("sha256").update(link).digest("hex").slice(0, 24)}`,
    link,
    title,
    date: "",
    category: inferCategory(title),
    image: null,
    readTime: null,
    description: "",
    author: domain || null,
    tags: [],
    metrics: null,
    isFeatured: false,
    source: "external",
  };
}

export function normalizeGdeltArticles(
  input: unknown,
  category: ResourceCategory | "all",
  limit: number
): Resource[] {
  if (!Array.isArray(input)) return [];
  const maximum = Math.max(0, Math.floor(limit));
  if (maximum === 0) return [];

  const resources: Resource[] = [];
  for (const candidate of input) {
    if (!candidate || typeof candidate !== "object") continue;
    const resource = normalizeArticle(candidate as GdeltArticle);
    if (!resource || (category !== "all" && resource.category !== category)) {
      continue;
    }
    resources.push(resource);
    if (resources.length === maximum) break;
  }
  return resources;
}

export async function fetchGdeltResources(
  category: ResourceCategory | "all",
  search: string,
  limit: number,
  fetcher: typeof fetch = fetch
): Promise<Resource[]> {
  const query = buildGdeltQuery(category, search);
  if (!query) return [];

  const params = new URLSearchParams({
    query,
    mode: "artlist",
    format: "json",
    maxrecords: String(Math.min(50, Math.max(1, limit * 3))),
    sort: "HybridRel",
    timespan: "3months",
  });
  const response = await fetcher(
    `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`,
    {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(6_000),
      next: { revalidate: 600 },
    }
  );
  if (!response.ok) {
    throw new Error(`GDELT request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as GdeltResponse;
  if (!payload || !Array.isArray(payload.articles)) {
    throw new Error("GDELT returned an invalid response");
  }

  return normalizeGdeltArticles(payload.articles, category, limit);
}

function titleDedupKey(resource: Resource): string | null {
  const title = normalizedTitle(resource.title);
  return title.length >= 32 ? title : null;
}

export function mergeResources(
  firstParty: Resource[],
  external: Resource[]
): Resource[] {
  const merged: Resource[] = [];
  const urls = new Set<string>();
  const titles = new Set<string>();

  for (const resource of [...firstParty, ...external]) {
    const url = resource.link ? normalizeArticleUrl(resource.link) : null;
    const title = titleDedupKey(resource);
    if ((url && urls.has(url)) || (title && titles.has(title))) {
      continue;
    }

    if (url) urls.add(url);
    if (title) titles.add(title);
    merged.push(resource);
  }

  return merged;
}
