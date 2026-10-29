import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { publicReadLimiter, checkRateLimit } from "@/lib/security/rate-limit";
import {
  fetchGdeltResources,
  getDiscoveryConfig,
  isResourceCategory,
  mergeResources,
  normalizeSearch,
  shouldDiscoverResources,
} from "@/lib/resources/discovery";
import type { Resource, ResourceCategory } from "@/types/resources";

export const runtime = "nodejs";

const MAX_SEARCH_LENGTH = 120;
const MAX_FIRST_PARTY_RESULTS = 100;

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

type BlogCategory = ResourceCategory;

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
  tags: string[] | null;
  metrics: { value: string; label: string }[] | null;
  is_featured: boolean;
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
    .order("date", { ascending: false })
    .limit(MAX_FIRST_PARTY_RESULTS);

  if (category !== "all") {
    query = query.eq("category", category);
  }

  if (search) {
    query = query.textSearch("fts", search, {
      type: "websearch",
      config: "english",
    });
  }

  const { data, error } = await query.returns<BlogRow[]>();
  if (error) throw new Error("Supabase resources query failed");

  return (data ?? []).map(
    (row) =>
      ({
        id: row.id,
        title: row.title,
        description: row.description,
        category: row.category,
        date: row.date,
        link: row.link,
        image: row.image,
        readTime: row.read_time,
        author: row.author,
        tags: row.tags ?? [],
        metrics: row.metrics,
        isFeatured: row.is_featured,
        source: "eaziwage",
      }) satisfies Resource
  );
}

function errorResponse(
  message: string,
  status: number,
  headers?: Record<string, string>
) {
  return NextResponse.json(
    { resources: [], total: 0, error: message },
    {
      status,
      headers: {
        "Cache-Control": "private, no-store, no-cache, must-revalidate",
        ...headers,
      },
    }
  );
}

function parseCategory(value: string): ResourceCategory | "all" | null {
  if (value === "all") return value;
  return isResourceCategory(value) ? value : null;
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  try {
    const rateLimit = await checkRateLimit(publicReadLimiter, ip);
    if (!rateLimit.success) {
      return errorResponse(
        "Rate limit exceeded. Please try again later.",
        429,
        rateLimit.headers
      );
    }

    const { searchParams } = new URL(request.url);
    if (
      searchParams.getAll("category").length > 1 ||
      searchParams.getAll("search").length > 1
    ) {
      return errorResponse("Invalid resource query.", 400);
    }

    const category = parseCategory(searchParams.get("category") ?? "all");
    const search = normalizeSearch(searchParams.get("search") ?? "");
    if (
      category === null ||
      search.length > MAX_SEARCH_LENGTH ||
      (search.length > 0 && !/[\p{L}\p{N}]/u.test(search))
    ) {
      return errorResponse("Invalid resource query.", 400);
    }

    const firstPartyResources = await fetchFromSupabase(category, search);
    const discoveryConfig = getDiscoveryConfig();
    let externalResources: Resource[] = [];
    let discoveryUnavailable = false;

    if (
      shouldDiscoverResources({
        config: discoveryConfig,
        category,
        search,
        firstPartyCount: firstPartyResources.length,
      })
    ) {
      try {
        externalResources = await fetchGdeltResources(
          category,
          search,
          discoveryConfig.limit
        );
      } catch (error) {
        discoveryUnavailable = true;
        console.warn("[resources] External discovery unavailable", {
          provider: "GDELT",
          category,
          error: error instanceof Error ? error.name : "UnknownError",
        });
      }
    }

    const resources = mergeResources(firstPartyResources, externalResources);
    return NextResponse.json(
      {
        resources,
        total: resources.length,
        ...(discoveryUnavailable ? { discoveryUnavailable: true } : {}),
      },
      {
        headers: {
          "Cache-Control": "private, no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[resources] Request failed", {
      error: error instanceof Error ? error.name : "UnknownError",
    });
    return errorResponse("Resources are temporarily unavailable.", 503);
  }
}
