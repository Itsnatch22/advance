import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Category → NewsAPI keyword mapping
const CATEGORY_QUERIES: Record<string, string> = {
  all: '"earned wage access" OR "financial inclusion" OR "fintech" OR "mobile money" Africa',
  guide:
    '"earned wage access" OR "EWA" OR "financial literacy" OR "payroll" Africa',
  blog: '"fintech Africa" OR "financial wellness" OR "mobile money" OR "neobank" Africa',
  "case-study":
    '"payroll Africa" OR "employer benefits Africa" OR "workforce finance" OR "salary advance" Africa',
  webinar:
    '"fintech event" OR "financial summit" OR "fintech conference" Africa',
  download:
    '"financial tool" OR "salary advance" OR "wage calculator" OR "payslip" Africa',
};

// Source name → inferred tags
function inferTags(sourceName: string, title: string): string[] {
  const tags: string[] = [];
  const combined = `${sourceName} ${title}`.toLowerCase();

  if (combined.includes("kenya") || combined.includes("nairobi"))
    tags.push("Kenya");
  if (combined.includes("nigeria") || combined.includes("lagos"))
    tags.push("Nigeria");
  if (combined.includes("ghana") || combined.includes("accra"))
    tags.push("Ghana");
  if (combined.includes("south africa") || combined.includes("johannesburg"))
    tags.push("South Africa");
  if (combined.includes("uganda") || combined.includes("kampala"))
    tags.push("Uganda");
  if (combined.includes("tanzania") || combined.includes("dar es salaam"))
    tags.push("Tanzania");
  if (combined.includes("rwanda") || combined.includes("kigali"))
    tags.push("Rwanda");
  if (combined.includes("ethiopia") || combined.includes("addis"))
    tags.push("Ethiopia");
  if (combined.includes("mobile money") || combined.includes("m-pesa"))
    tags.push("Mobile Money");
  if (combined.includes("fintech")) tags.push("Fintech");
  if (combined.includes("payroll")) tags.push("Payroll");
  if (combined.includes("financial wellness") || combined.includes("wellbeing"))
    tags.push("Wellness");
  if (combined.includes("startup")) tags.push("Startup");
  if (combined.includes("regulation") || combined.includes("central bank"))
    tags.push("Regulation");

  // Always tag with source
  if (sourceName) tags.push(sourceName);

  return [...new Set(tags)].slice(0, 4);
}

// Estimate read time from description length
function estimateReadTime(text?: string): string {
  if (!text) return "3 min";
  const words = text.split(" ").length;
  // Average article is ~5x the description length
  const estimatedWords = words * 5;
  const minutes = Math.max(2, Math.round(estimatedWords / 200));
  return `${minutes} min`;
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

function normalizeArticleUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.hash = "";

    [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
      "fbclid",
      "gclid",
    ].forEach((param) => parsed.searchParams.delete(param));

    parsed.search = parsed.searchParams.toString();
    return parsed.toString();
  } catch {
    return url.trim();
  }
}

function createResourceId(article: NewsAPIArticle, normalizedUrl: string): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        url: normalizedUrl,
        publishedAt: article.publishedAt,
        title: article.title,
      })
    )
    .digest("hex")
    .slice(0, 24);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || "all";
  const search = searchParams.get("search") || "";

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "NewsAPI key not configured" },
      { status: 500 }
    );
  }

  // Build query: category keywords + optional user search term
  let q = CATEGORY_QUERIES[category] || CATEGORY_QUERIES.all;
  if (search.trim()) {
    q = `(${q}) AND "${search.trim()}"`;
  }

  const params = new URLSearchParams({
    q,
    language: "en",
    sortBy: "publishedAt",
    pageSize: "30",
    apiKey,
  });

  // Date range: last 30 days
  const from = new Date();
  from.setDate(from.getDate() - 30);
  params.set("from", from.toISOString().split("T")[0]);

  try {
    const res = await fetch(
      `https://newsapi.org/v2/everything?${params.toString()}`,
      {
        headers: { "User-Agent": "EaziWage/1.0" },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      return NextResponse.json(
        { error: err.message || "NewsAPI error" },
        { status: res.status }
      );
    }

    const data = await res.json();

    // Filter out articles with "[Removed]" content (NewsAPI quirk)
    const articles: NewsAPIArticle[] = (data.articles || []).filter(
      (a: NewsAPIArticle) =>
        a.title !== "[Removed]" &&
        a.description &&
        a.description !== "[Removed]" &&
        a.url
    );

    // Map NewsAPI shape → Resource shape
    const seenArticles = new Set<string>();
    const resources = articles.flatMap((article) => {
      const normalizedUrl = normalizeArticleUrl(article.url);
      const dedupeKey = `${normalizedUrl}::${article.title.trim().toLowerCase()}`;

      if (seenArticles.has(dedupeKey)) {
        return [];
      }

      seenArticles.add(dedupeKey);

      return {
        id: createResourceId(article, normalizedUrl),
        title: article.title,
        description: article.description || "",
        category:
          category === "all"
            ? inferCategory(article.title, article.description || "")
            : category,
        image: article.urlToImage,
        author: article.author || article.source.name,
        date: article.publishedAt,
        readTime: estimateReadTime(article.description || ""),
        tags: inferTags(article.source.name, article.title),
        link: normalizedUrl,
        metrics: undefined,
      };
    });

    return NextResponse.json(
      { resources, total: resources.length },
      {
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (err) {
    console.error("NewsAPI fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch news" },
      { status: 500 }
    );
  }
}

// Infer category from article content when fetching "all"
function inferCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase();
  if (
    text.includes("how to") ||
    text.includes("guide") ||
    text.includes("setup") ||
    text.includes("tips")
  )
    return "guide";
  if (
    text.includes("case study") ||
    text.includes("success story") ||
    text.includes("% reduction") ||
    text.includes("transformed")
  )
    return "case-study";
  if (
    text.includes("webinar") ||
    text.includes("conference") ||
    text.includes("summit") ||
    text.includes("event")
  )
    return "webinar";
  if (
    text.includes("tool") ||
    text.includes("calculator") ||
    text.includes("template") ||
    text.includes("download")
  )
    return "download";
  return "blog"; // default
}
