import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { GET } from "./route";

jest.mock("@supabase/supabase-js", () => ({
  createClient: jest.fn(),
}));

jest.mock("@/lib/security/rate-limit", () => ({
  publicReadLimiter: {},
  checkRateLimit: jest.fn(),
}));

const mockCreateClient = jest.mocked(createClient);
const mockCheckRateLimit = jest.mocked(checkRateLimit);

const curatedResource = {
  id: "curated",
  title: "Kenya employers introduce earned wage access through payroll fintech",
  description: "EaziWage's curated resource.",
  category: "blog",
  date: "2026-10-01",
  link: "https://eaziwage.com/resources/curated",
  image: null,
  read_time: null,
  author: "EaziWage",
  tags: [],
  metrics: null,
  is_featured: true,
};

function createSupabaseQuery(data: unknown, error: unknown = null) {
  const query = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    textSearch: jest.fn().mockReturnThis(),
    returns: jest.fn().mockResolvedValue({ data, error }),
  };
  mockCreateClient.mockReturnValue({
    from: jest.fn(() => query),
  } as never);
  return query;
}

function request(path: string) {
  return new NextRequest(`https://eaziwage.com/api/resources${path}`, {
    headers: { "x-forwarded-for": "203.0.113.10" },
  });
}

describe("GET /api/resources", () => {
  const originalFetch = global.fetch;
  const originalDiscoveryEnabled = process.env.RESOURCE_DISCOVERY_ENABLED;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "server-only-test-key";
    delete process.env.RESOURCE_DISCOVERY_ENABLED;
    mockCheckRateLimit.mockResolvedValue({
      success: true,
      limit: 120,
      remaining: 119,
      reset: Date.now() + 60_000,
      headers: {},
    });
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        articles: [
          {
            title:
              "Uganda payroll and financial inclusion improve employer adoption",
            url: "https://publisher.example/insight",
            domain: "publisher.example",
          },
        ],
      }),
    })) as unknown as typeof fetch;
  });

  afterAll(() => {
    global.fetch = originalFetch;
    if (originalDiscoveryEnabled === undefined) {
      delete process.env.RESOURCE_DISCOVERY_ENABLED;
    } else {
      process.env.RESOURCE_DISCOVERY_ENABLED = originalDiscoveryEnabled;
    }
  });

  test("returns database resources and external supplements in a compatible shape", async () => {
    const query = createSupabaseQuery([curatedResource]);
    const response = await GET(request("?category=all"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      total: 2,
      resources: [
        { id: "curated", source: "eaziwage", isFeatured: true },
        { source: "external", author: "publisher.example" },
      ],
    });
    expect(response.headers.get("cache-control")).toContain("no-store");
    expect(query.eq).toHaveBeenCalledWith("is_published", true);
    expect(query.limit).toHaveBeenCalledWith(100);
    expect(JSON.stringify(payload)).not.toContain("server-only-test-key");
  });

  test("does not call discovery when sufficient curated results already exist", async () => {
    createSupabaseQuery(
      Array.from({ length: 6 }, (_, index) => ({
        ...curatedResource,
        id: `curated-${index}`,
      }))
    );

    const response = await GET(request("?category=all"));

    expect(response.status).toBe(200);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  test("search always attempts discovery and safely degrades on provider failure", async () => {
    createSupabaseQuery([curatedResource]);
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error("provider unavailable"));

    const response = await GET(request("?search=Kenya%20payroll"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.resources).toHaveLength(1);
    expect(payload.discoveryUnavailable).toBe(true);
    expect(payload.error).toBeUndefined();
  });

  test("returns an explicit client error for unsupported categories and oversized queries", async () => {
    createSupabaseQuery([curatedResource]);

    const invalidCategory = await GET(request("?category=unknown"));
    const longSearch = await GET(request(`?search=${"x".repeat(121)}`));

    expect(invalidCategory.status).toBe(400);
    expect(longSearch.status).toBe(400);
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  test("rejects malformed free-text queries before calling the database", async () => {
    createSupabaseQuery([curatedResource]);

    const response = await GET(request("?search=%23%23%23"));

    expect(response.status).toBe(400);
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  test("applies category filtering to curated and external resources", async () => {
    const query = createSupabaseQuery([]);
    global.fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({
        articles: [
          {
            title:
              "Kenya earned wage access implementation guide for payroll teams",
            url: "https://publisher.example/guide",
            domain: "publisher.example",
          },
          {
            title:
              "Kenya employers introduce earned wage access through payroll fintech",
            url: "https://publisher.example/news",
            domain: "publisher.example",
          },
        ],
      }),
    })) as unknown as typeof fetch;

    const response = await GET(request("?category=guide"));
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(query.eq).toHaveBeenCalledWith("category", "guide");
    expect(payload.resources).toHaveLength(1);
    expect(payload.resources[0].category).toBe("guide");
  });

  test("does not report a successful empty response when Supabase fails", async () => {
    createSupabaseQuery(null, { message: "private database detail" });

    const response = await GET(request("?category=all"));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload).toMatchObject({
      resources: [],
      total: 0,
      error: "Resources are temporarily unavailable.",
    });
    expect(JSON.stringify(payload)).not.toContain("private database detail");
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
