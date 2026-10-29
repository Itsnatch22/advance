import {
  buildGdeltQuery,
  fetchGdeltResources,
  getDiscoveryConfig,
  mergeResources,
  normalizeArticleUrl,
  normalizeGdeltArticles,
  normalizeSearch,
  shouldDiscoverResources,
} from "./discovery";
import type { Resource } from "@/types/resources";

const relevantArticle = {
  title: "Kenya employers introduce earned wage access through payroll fintech",
  url: "https://www.example.org/article?utm_source=newsletter",
  domain: "example.org",
  socialimage: "https://images.example.org/article.jpg",
};

function firstParty(overrides: Partial<Resource> = {}): Resource {
  return {
    id: "curated-1",
    title:
      "Kenya employers introduce earned wage access through payroll fintech",
    description: "Curated EaziWage resource description.",
    category: "blog",
    date: "2026-10-01",
    link: "https://www.example.org/article",
    image: null,
    readTime: null,
    author: "EaziWage",
    tags: [],
    metrics: null,
    isFeatured: true,
    source: "eaziwage",
    ...overrides,
  };
}

describe("resource discovery policy", () => {
  test("normalizes whitespace and control characters from search input", () => {
    expect(normalizeSearch("  payroll\t\n Kenya  ")).toBe("payroll Kenya");
  });

  test("uses a bounded discovery configuration with safe defaults", () => {
    expect(getDiscoveryConfig({})).toEqual({
      enabled: true,
      limit: 12,
      minimumFirstPartyResults: 6,
    });
    expect(
      getDiscoveryConfig({
        RESOURCE_DISCOVERY_ENABLED: "false",
        RESOURCE_DISCOVERY_LIMIT: "999",
        RESOURCE_DISCOVERY_MIN_FIRST_PARTY: "-1",
      })
    ).toEqual({
      enabled: false,
      limit: 30,
      minimumFirstPartyResults: 6,
    });
  });

  test("discovers for searches and sparse results, but skips disabled and unsupported categories", () => {
    const config = {
      enabled: true,
      limit: 12,
      minimumFirstPartyResults: 6,
    };

    expect(
      shouldDiscoverResources({
        config,
        category: "all",
        search: "payroll",
        firstPartyCount: 20,
      })
    ).toBe(true);
    expect(
      shouldDiscoverResources({
        config,
        category: "all",
        search: "",
        firstPartyCount: 5,
      })
    ).toBe(true);
    expect(
      shouldDiscoverResources({
        config,
        category: "all",
        search: "",
        firstPartyCount: 6,
      })
    ).toBe(false);
    expect(
      shouldDiscoverResources({
        config: { ...config, enabled: false },
        category: "all",
        search: "payroll",
        firstPartyCount: 0,
      })
    ).toBe(false);
    expect(
      shouldDiscoverResources({
        config,
        category: "download",
        search: "calculator",
        firstPartyCount: 0,
      })
    ).toBe(false);
  });

  test("builds category-aware, regionally relevant queries and quotes user terms safely", () => {
    const query = buildGdeltQuery("all", 'Kenya" OR "politics');
    expect(query).toContain('"earned wage access"');
    expect(query).toContain('"South Africa"');
    expect(query).toContain('"Kenya" AND "OR" AND "politics"');
    expect(query).not.toContain('Kenya" OR "politics');
    expect(buildGdeltQuery("webinar", "")).toBeNull();
    expect(buildGdeltQuery("guide", "")).toContain(
      '(guide OR tutorial OR implementation OR "how to")'
    );
    expect(buildGdeltQuery("case-study", "")).toContain('"case study"');
  });

  test("does not mistake EWA for a topic unless financial context is present", () => {
    expect(
      normalizeGdeltArticles(
        [
          {
            title: "EWA culture festival announced",
            url: "https://example.org/culture",
          },
          {
            title: "EWA payroll fintech expands in Kenya",
            url: "https://example.org/payroll",
          },
        ],
        "all",
        10
      )
    ).toHaveLength(1);
  });
});

describe("GDELT normalization and merging", () => {
  test("normalizes valid external results and tolerates missing optional fields", () => {
    const [resource] = normalizeGdeltArticles(
      [
        relevantArticle,
        {
          title: "Payroll and financial inclusion in Uganda",
          url: "https://example.net/story",
        },
      ],
      "all",
      10
    );

    expect(resource).toMatchObject({
      source: "external",
      category: "blog",
      author: "example.org",
      date: "",
      description: "",
      image: null,
      isFeatured: false,
      metrics: null,
    });
    expect(resource.link).toBe("https://example.org/article");
  });

  test("does not mistake an unrelated use of EWA for earned wage access", () => {
    expect(
      normalizeGdeltArticles(
        [
          {
            title: "EWA art awards announced",
            url: "https://example.org/arts",
          },
        ],
        "all",
        10
      )
    ).toHaveLength(0);
    expect(
      normalizeGdeltArticles(
        [
          {
            title: "Kenya fintech expands earned wage access",
            url: "https://example.org/finance",
          },
        ],
        "all",
        10
      )
    ).toHaveLength(1);
  });

  test("rejects malformed or unsafe links and non-HTTPS images", () => {
    expect(
      normalizeGdeltArticles(
        [
          {
            title: "Kenya fintech expands earned wage access",
            url: "javascript:alert(1)",
          },
          {
            title: "Uganda payroll and financial inclusion",
            url: "https://example.org/good",
            socialimage: "http://images.example.org/a.jpg",
          },
          { title: "Nigeria salary advance reaches employers" },
          null,
        ],
        "all",
        10
      )
    ).toMatchObject([{ image: null }]);
  });

  test("assigns categories only when the title provides evidence", () => {
    const articles = normalizeGdeltArticles(
      [
        {
          ...relevantArticle,
          title: "How to implement earned wage access in Kenya",
        },
        {
          ...relevantArticle,
          url: "https://example.org/study",
          title: "Earned wage access case study from Uganda",
        },
      ],
      "all",
      10
    );

    expect(articles.map((article) => article.category)).toEqual([
      "guide",
      "case-study",
    ]);
    expect(normalizeGdeltArticles([relevantArticle], "guide", 10)).toHaveLength(
      0
    );
  });

  test("canonicalizes tracking parameters, fragments, and trailing slashes", () => {
    expect(
      normalizeArticleUrl(
        "https://www.Example.org/story/?utm_source=email&ref=partner#section"
      )
    ).toBe("https://example.org/story?ref=partner");
    expect(normalizeArticleUrl("javascript:alert(1)")).toBeNull();
  });

  test("deduplicates tracked URLs and syndicated exact titles, keeping curated data", () => {
    const external = normalizeGdeltArticles(
      [
        relevantArticle,
        {
          ...relevantArticle,
          url: "https://another.example.org/reprint",
        },
      ],
      "all",
      10
    );
    const merged = mergeResources([firstParty()], external);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({
      id: "curated-1",
      description: "Curated EaziWage resource description.",
      source: "eaziwage",
      isFeatured: true,
    });
  });

  test("keeps distinct titles and preserves first-party ordering", () => {
    const external = normalizeGdeltArticles(
      [
        relevantArticle,
        {
          title:
            "Uganda payroll and financial inclusion improve employer adoption",
          url: "https://example.org/uganda",
          domain: "example.org",
        },
      ],
      "all",
      10
    );
    const featured = firstParty();
    const otherCurated = firstParty({
      id: "curated-2",
      title: "EaziWage employee payroll guide",
      link: "https://eaziwage.com/resources/other",
      isFeatured: false,
    });

    expect(
      mergeResources([featured, otherCurated], external).map((item) => item.id)
    ).toEqual(["curated-1", "curated-2", external[1].id]);
  });
});

describe("GDELT provider request", () => {
  test("uses a bounded query and asks Next's data cache to revalidate", async () => {
    const fetcher = jest.fn(async () => ({
      ok: true,
      json: async () => ({ articles: [relevantArticle] }),
    })) as unknown as typeof fetch;

    const resources = await fetchGdeltResources(
      "all",
      "Kenya fintech",
      8,
      fetcher
    );
    const [url, options] = (fetcher as jest.Mock).mock.calls[0] as [
      string,
      RequestInit & { next?: { revalidate?: number } },
    ];

    expect(resources).toHaveLength(1);
    expect(new URL(url).searchParams.get("maxrecords")).toBe("24");
    expect(new URL(url).searchParams.get("sort")).toBe("HybridRel");
    expect(options.next?.revalidate).toBe(600);
    expect(options.signal).toBeInstanceOf(AbortSignal);
  });

  test("fails explicitly for malformed responses and provider errors", async () => {
    const invalidPayload = jest.fn(async () => ({
      ok: true,
      json: async () => ({ articles: {} }),
    })) as unknown as typeof fetch;
    const unavailable = jest.fn(async () => ({
      ok: false,
      status: 429,
      json: async () => ({}),
    })) as unknown as typeof fetch;

    await expect(
      fetchGdeltResources("all", "", 4, invalidPayload)
    ).rejects.toThrow("invalid response");
    await expect(
      fetchGdeltResources("all", "", 4, unavailable)
    ).rejects.toThrow("status 429");
  });
});
