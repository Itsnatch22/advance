import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

// Category → NewsAPI keyword mapping
const CATEGORY_QUERIES: Record<string, string> = {
  all: '"earned wage access" OR "EWA" OR "earned wages" OR "salary advance" OR "on-demand pay" OR "flexible wages" OR "wage streaming" Africa',
  guide:
    '"earned wage access guide" OR "EWA implementation" OR "on-demand payroll" OR "flexible pay setup" Africa',
  blog: '"earned wage access Africa" OR "EWA Africa" OR "salary advance Africa" OR "on-demand pay Africa" OR "flexible wages Africa"',
  "case-study":
    '"earned wage access case study" OR "EWA success story" OR "salary advance implementation" OR "on-demand payroll Africa"',
  webinar:
    '"earned wage access webinar" OR "EWA summit" OR "on-demand pay conference" OR "flexible wages event" Africa',
  download:
    '"earned wage access tool" OR "EWA calculator" OR "salary advance template" OR "on-demand payroll guide" Africa',
};

// Source name → inferred tags
function inferTags(sourceName: string, title: string): string[] {
  const tags: string[] = [];
  const combined = `${sourceName} ${title}`.toLowerCase();

  // African countries
  if (combined.includes("kenya") || combined.includes("nairobi"))
    tags.push("Kenya");
  if (combined.includes("nigeria") || combined.includes("lagos"))
    tags.push("Nigeria");
  if (combined.includes("ghana") || combined.includes("accra"))
    tags.push("Ghana");
  if (combined.includes("south africa") || combined.includes("johannesburg") || combined.includes("capetown"))
    tags.push("South Africa");
  if (combined.includes("uganda") || combined.includes("kampala"))
    tags.push("Uganda");
  if (combined.includes("tanzania") || combined.includes("dar es salaam"))
    tags.push("Tanzania");
  if (combined.includes("rwanda") || combined.includes("kigali"))
    tags.push("Rwanda");
  if (combined.includes("ethiopia") || combined.includes("addis"))
    tags.push("Ethiopia");
  if (combined.includes("zambia") || combined.includes("lusaka"))
    tags.push("Zambia");
  if (combined.includes("zimbabwe") || combined.includes("harare"))
    tags.push("Zimbabwe");
  if (combined.includes("botswana") || combined.includes("gaborone"))
    tags.push("Botswana");
  if (combined.includes("senegal") || combined.includes("dakar"))
    tags.push("Senegal");
  if (combined.includes("ivory coast") || combined.includes("abidjan"))
    tags.push("Ivory Coast");
  if (combined.includes("cameroon") || combined.includes("douala"))
    tags.push("Cameroon");
  if (combined.includes("egypt") || combined.includes("cairo"))
    tags.push("Egypt");
  if (combined.includes("morocco") || combined.includes("casablanca"))
    tags.push("Morocco");

  // EWA-specific terminology
  if (combined.includes("earned wage access") || combined.includes("ewa"))
    tags.push("EWA");
  if (combined.includes("salary advance") || combined.includes("salary advance"))
    tags.push("Salary Advance");
  if (combined.includes("on-demand pay") || combined.includes("on demand pay"))
    tags.push("On-Demand Pay");
  if (combined.includes("flexible wages") || combined.includes("flexible pay"))
    tags.push("Flexible Wages");
  if (combined.includes("wage streaming") || combined.includes("wage streaming"))
    tags.push("Wage Streaming");
  if (combined.includes("earned wages") || combined.includes("earned wages"))
    tags.push("Earned Wages");
  if (combined.includes("payroll innovation") || combined.includes("payroll tech"))
    tags.push("Payroll Innovation");
  if (combined.includes("employee benefits") || combined.includes("worker benefits"))
    tags.push("Employee Benefits");
  if (combined.includes("financial inclusion") || combined.includes("financial inclusion"))
    tags.push("Financial Inclusion");
  if (combined.includes("workforce finance") || combined.includes("workforce finance"))
    tags.push("Workforce Finance");

  // Supporting technologies
  if (combined.includes("mobile money") || combined.includes("m-pesa"))
    tags.push("Mobile Money");
  if (combined.includes("fintech")) tags.push("Fintech");
  if (combined.includes("payroll")) tags.push("Payroll");
  if (combined.includes("digital banking") || combined.includes("digital bank"))
    tags.push("Digital Banking");
  if (combined.includes("neobank") || combined.includes("neo bank"))
    tags.push("Neobank");

  // Business context
  if (combined.includes("financial wellness") || combined.includes("wellbeing"))
    tags.push("Wellness");
  if (combined.includes("startup")) tags.push("Startup");
  if (combined.includes("regulation") || combined.includes("central bank"))
    tags.push("Regulation");
  if (combined.includes("implementation") || combined.includes("deployment"))
    tags.push("Implementation");
  if (combined.includes("case study") || combined.includes("success story"))
    tags.push("Case Study");

  // Always tag with source
  if (sourceName) tags.push(sourceName);

  return [...new Set(tags)].slice(0, 5);
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

    // Filter for EWA relevance with quality scoring
    const filteredArticles = articles.filter((article: NewsAPIArticle) => {
      const text = `${article.title} ${article.description || ""}`.toLowerCase();
      
      // EWA relevance scoring
      let score = 0;
      
      // High-value EWA terms (3 points each)
      const highValueTerms = [
        "earned wage access", "ewa", "earned wages", "on-demand pay", 
        "flexible wages", "wage streaming", "salary advance"
      ];
      
      // Medium-value terms (2 points each)
      const mediumValueTerms = [
        "payroll innovation", "employee benefits", "workforce finance",
        "financial inclusion", "payroll tech", "employee financial wellness"
      ];
      
      // Supporting terms (1 point each)
      const supportingTerms = [
        "payroll", "fintech", "mobile money", "digital banking",
        "neobank", "employee benefits", "financial wellness",
        "wages", "salary", "workers", "employer", "workforce"
      ];
      
      // African countries (2 points each)
      const africanCountries = [
        "kenya", "nigeria", "ghana", "south africa", "uganda", "tanzania",
        "rwanda", "ethiopia", "zambia", "zimbabwe", "botswana", "senegal",
        "ivory coast", "cameroon", "egypt", "morocco"
      ];
      
      // Calculate score
      highValueTerms.forEach(term => {
        if (text.includes(term)) score += 3;
      });
      
      mediumValueTerms.forEach(term => {
        if (text.includes(term)) score += 2;
      });
      
      supportingTerms.forEach(term => {
        if (text.includes(term)) score += 1;
      });
      
      africanCountries.forEach(country => {
        if (text.includes(country)) score += 2;
      });
      
      // Require minimum score of 3 for EWA relevance
      return score >= 2;
    });

    // Map NewsAPI shape → Resource shape
    const seenArticles = new Set<string>();
    const resources = filteredArticles.flatMap((article) => {
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

    console.log({
      totalFromAPI: data.articles?.length,
      afterRemovedFilter: articles.length,
      afterRelevanceFilter: filteredArticles.length,
      finalResources: resources.length,
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
  
  // Guides - "how to" content, implementation guides, setup instructions
  if (
    text.includes("how to") ||
    text.includes("guide") ||
    text.includes("setup") ||
    text.includes("tips") ||
    text.includes("implementation") ||
    text.includes("step by step") ||
    text.includes("tutorial") ||
    text.includes("getting started")
  )
    return "guide";
  
  // Case Studies - success stories, implementations with results
  if (
    text.includes("case study") ||
    text.includes("success story") ||
    text.includes("% reduction") ||
    text.includes("transformed") ||
    text.includes("results") ||
    text.includes("implementation") ||
    text.includes("deployment") ||
    text.includes("achieved") ||
    text.includes("improved")
  )
    return "case-study";
  
  // Webinars - events, conferences, summits
  if (
    text.includes("webinar") ||
    text.includes("conference") ||
    text.includes("summit") ||
    text.includes("event") ||
    text.includes("workshop") ||
    text.includes("panel") ||
    text.includes("discussion")
  )
    return "webinar";
  
  // Downloads - tools, calculators, templates
  if (
    text.includes("tool") ||
    text.includes("calculator") ||
    text.includes("template") ||
    text.includes("download") ||
    text.includes("spreadsheet") ||
    text.includes("checklist") ||
    text.includes("framework")
  )
    return "download";
  
  return "blog"; // default for insights, news, analysis
}
