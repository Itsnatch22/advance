import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { publicReadLimiter, checkRateLimit } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase env vars not configured");
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

type BlogCategory = "guide" | "blog" | "case-study" | "webinar" | "download";

interface BlogRow {
  id: string;
  title: string;
  description: string;
  category: BlogCategory;
  date: string;
  link: string | null;
  image: string | null;
  read_time: string | null;
  author: string | null;
  tags: string[];
  metrics: { value: string; label: string }[] | null;
  is_featured: boolean;
}

interface Resource {
  id: string;
  title: string;
  description: string;
  category: BlogCategory;
  date: string;
  link: string | null;
  image: string | null;
  readTime: string | null;
  author: string | null;
  tags: string[];
  metrics: { value: string; label: string }[] | null;
  isFeatured: boolean;
}

interface NewsAPIArticle {
  source: { id: string | null; name: string };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

async function fetchFromSupabase(
  category: string,
  search: string
): Promise<Resource[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from("blogs")
    .select(
      "id, title, description, category, date, link, image, read_time, author, tags, metrics, is_featured"
    )
    .eq("is_published", true)
    .order("is_featured", { ascending: false })
    .order("date", { ascending: false });

  
  if (category !== "all") {
    query = query.eq("category", category);
  }

  
  if (search.trim()) {
    query = query.textSearch("fts", search.trim(), {
      type: "websearch",
      config: "english",
    });
  }

  const { data, error } = await query.returns<BlogRow[]>();

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    date: row.date,
    link: row.link,
    image: row.image,
    readTime: row.read_time,
    author: row.author,
    tags: row.tags,
    metrics: row.metrics,
    isFeatured: row.is_featured,
  }));
}

const CATEGORY_QUERIES: Record<string, string> = {
  all: '"earned wage access" OR "EWA" OR "earned wages" OR "salary advance" OR "on-demand pay" OR "flexible wages" OR "wage streaming" Africa',
  guide:
    '"earned wage access guide" OR "EWA implementation" OR "on-demand payroll" OR "flexible pay setup" Africa',
  blog: '"earned wage access Africa" OR "EWA Africa" OR "salary advance Africa" OR "on-demand pay Africa"',
  "case-study":
    '"earned wage access case study" OR "EWA success story" OR "salary advance implementation" OR "on-demand payroll Africa"',
  webinar:
    '"earned wage access webinar" OR "EWA summit" OR "on-demand pay conference" Africa',
  download:
    '"earned wage access tool" OR "EWA calculator" OR "salary advance template" Africa',
};

function normalizeArticleUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "fbclid", "gclid"].forEach(
      (p) => parsed.searchParams.delete(p)
    );
    parsed.search = parsed.searchParams.toString();
    return parsed.toString();
  } catch {
    return url.trim();
  }
}

function createResourceId(article: NewsAPIArticle, normalizedUrl: string): string {
  return createHash("sha256")
    .update(JSON.stringify({ url: normalizedUrl, publishedAt: article.publishedAt, title: article.title }))
    .digest("hex")
    .slice(0, 24);
}

function inferTags(sourceName: string, title: string): string[] {
  const tags: string[] = [];
  const combined = `${sourceName} ${title}`.toLowerCase();

  const countryMap: [string, string][] = [
    ["kenya", "Kenya"], ["nairobi", "Kenya"],
    ["nigeria", "Nigeria"], ["lagos", "Nigeria"],
    ["ghana", "Ghana"], ["south africa", "South Africa"],
    ["uganda", "Uganda"], ["tanzania", "Tanzania"],
    ["rwanda", "Rwanda"], ["ethiopia", "Ethiopia"],
  ];
  countryMap.forEach(([kw, tag]) => { if (combined.includes(kw)) tags.push(tag); });

  if (combined.includes("earned wage access") || combined.includes("ewa")) tags.push("EWA");
  if (combined.includes("on-demand pay")) tags.push("On-Demand Pay");
  if (combined.includes("salary advance")) tags.push("Salary Advance");
  if (combined.includes("fintech")) tags.push("Fintech");
  if (combined.includes("payroll")) tags.push("Payroll");
  if (combined.includes("mobile money") || combined.includes("m-pesa")) tags.push("Mobile Money");
  if (combined.includes("financial inclusion")) tags.push("Financial Inclusion");
  if (sourceName) tags.push(sourceName);

  return [...new Set(tags)].slice(0, 5);
}

function estimateReadTime(text?: string): string {
  if (!text) return "3 min";
  const words = text.split(" ").length;
  const minutes = Math.max(2, Math.round((words * 5) / 200));
  return `${minutes} min`;
}

function inferCategory(title: string, description: string): BlogCategory {
  const text = `${title} ${description}`.toLowerCase();
  if (text.includes("how to") || text.includes("guide") || text.includes("tutorial")) return "guide";
  if (text.includes("case study") || text.includes("success story") || text.includes("achieved")) return "case-study";
  if (text.includes("webinar") || text.includes("conference") || text.includes("summit")) return "webinar";
  if (text.includes("tool") || text.includes("calculator") || text.includes("template") || text.includes("download")) return "download";
  return "blog";
}

function isEwaRelevant(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  let score = 0;

  const high = ["earned wage access", "ewa", "on-demand pay", "flexible wages", "wage streaming", "salary advance"];
  const medium = ["payroll innovation", "employee financial wellness", "workforce finance", "financial inclusion"];
  const low = ["payroll", "fintech", "mobile money", "wages", "salary", "workers", "employer"];
  const african = ["kenya", "nigeria", "ghana", "south africa", "uganda", "tanzania", "rwanda", "ethiopia"];

  high.forEach((t) => { if (text.includes(t)) score += 3; });
  medium.forEach((t) => { if (text.includes(t)) score += 2; });
  low.forEach((t) => { if (text.includes(t)) score += 1; });
  african.forEach((t) => { if (text.includes(t)) score += 2; });

  return score >= 3;
}

async function fetchFromNewsAPI(
  category: string,
  search: string
): Promise<Resource[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) return [];

  let q = CATEGORY_QUERIES[category] ?? CATEGORY_QUERIES.all;
  if (search.trim()) q = `(${q}) AND "${search.trim()}"`;

  const params = new URLSearchParams({
    q,
    language: "en",
    sortBy: "publishedAt",
    pageSize: "20",
    apiKey,
  });

  const from = new Date();
  from.setDate(from.getDate() - 30);
  params.set("from", from.toISOString().split("T")[0]);

  const res = await fetch(`https://newsapi.org/v2/everything?${params.toString()}`, {
    headers: { "User-Agent": "EaziWage/1.0" },
  });
  if (!res.ok) return [];

  const data = (await res.json()) as { articles?: NewsAPIArticle[] };
  const articles = (data.articles ?? []).filter(
    (a) => a.title !== "[Removed]" && a.description && a.description !== "[Removed]" && a.url
  );

  const seen = new Set<string>();

  return articles
    .filter((a) => isEwaRelevant(a.title, a.description ?? ""))
    .flatMap((article) => {
      const normalizedUrl = normalizeArticleUrl(article.url);
      const dedupeKey = `${normalizedUrl}::${article.title.trim().toLowerCase()}`;
      if (seen.has(dedupeKey)) return [];
      seen.add(dedupeKey);

      const cat =
        category === "all"
          ? inferCategory(article.title, article.description ?? "")
          : (category as BlogCategory);

      return [
        {
          id: createResourceId(article, normalizedUrl),
          title: article.title,
          description: article.description ?? "",
          category: cat,
          date: article.publishedAt.split("T")[0],
          link: normalizedUrl,
          image: article.urlToImage,
          readTime: estimateReadTime(article.description ?? ""),
          author: article.author ?? article.source.name,
          tags: inferTags(article.source.name, article.title),
          metrics: null,
          isFeatured: false,
        } satisfies Resource,
      ];
    });
}

export async function GET(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const rl = await checkRateLimit(publicReadLimiter, ip);
  if (!rl.success) {
    return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429, headers: rl.headers });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? "all";
  const search = searchParams.get("search") ?? "";

  try {
    let resources = await fetchFromSupabase(category, search);

    if (resources.length === 0 && search.trim()) {
      console.log("[resources] Supabase empty for search — falling back to NewsAPI");
      resources = await fetchFromNewsAPI(category, search);
    }

    return NextResponse.json(
      { resources, total: resources.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (err) {
    console.error("[resources] Handler error:", err);

    try {
      const fallback = await fetchFromNewsAPI(category, search);
      return NextResponse.json(
        { resources: fallback, total: fallback.length, source: "newsapi-fallback" },
        { status: 200 }
      );
    } catch {
      return NextResponse.json(
        { error: "Failed to fetch resources" },
        { status: 500 }
      );
    }
  }
}