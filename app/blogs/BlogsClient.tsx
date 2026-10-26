"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ElementType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  Download,
  ExternalLink,
  FileText,
  Layers,
  LoaderCircle,
  Newspaper,
  Search,
  TrendingUp,
  Users,
  Video,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import TiltCard from "@/components/shared/TiltCard";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { useRealtimeRefresh } from "@/hooks/useRealtimeRefresh";
import type { Resource, ResourceCategory } from "@/types/resources";

interface CategoryOption {
  id: "all" | ResourceCategory;
  label: string;
  icon: ElementType;
}

const categories: CategoryOption[] = [
  { id: "all", label: "All EWA Content", icon: Layers },
  { id: "guide", label: "Implementation Guides", icon: FileText },
  { id: "blog", label: "EWA Insights", icon: TrendingUp },
  { id: "case-study", label: "Success Stories", icon: Users },
  { id: "webinar", label: "EWA Events", icon: Video },
  { id: "download", label: "EWA Tools", icon: Download },
];

const RESOURCES_PER_PAGE = 6;
const RESOURCE_REFRESH_INTERVAL = 60_000;

const categoryLabels: Record<ResourceCategory, string> = {
  guide: "Implementation guide",
  blog: "EWA insight",
  "case-study": "Success story",
  webinar: "EWA event",
  download: "EWA tool",
};

function getResourceDedupKey(resource: Resource): string {
  return [
    resource.link?.trim().toLowerCase(),
    resource.title.trim().toLowerCase(),
    resource.date,
  ]
    .filter(Boolean)
    .join("::");
}

function formatDate(date: string): string | null {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return null;

  return parsed.toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDestination(link: string | null | undefined) {
  if (!link?.trim()) return null;

  try {
    const url = new URL(link, "https://eaziwage.com");
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;

    const internal = url.hostname === "eaziwage.com" || url.hostname.endsWith(".eaziwage.com");
    return {
      href: internal ? `${url.pathname}${url.search}${url.hash}` : url.toString(),
      external: !internal,
    };
  } catch {
    return null;
  }
}

function ResourceAction({ resource }: { resource: Resource }) {
  const destination = getDestination(resource.link);
  if (!destination) {
    return <span className="text-sm text-slate-400">Link unavailable</span>;
  }

  const label = resource.category === "download" ? "Get resource" : "Read more";
  const className =
    "inline-flex min-h-10 items-center gap-2 text-sm font-bold text-green-700 transition-colors hover:text-green-800 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700";

  if (destination.external) {
    return (
      <a
        href={destination.href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {label}
        <ExternalLink size={15} aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link href={destination.href} className={className}>
      {label}
      <ArrowRight size={15} aria-hidden="true" />
    </Link>
  );
}

function ResourceCard({
  resource,
  featured = false,
}: {
  resource: Resource;
  featured?: boolean;
}) {
  const date = formatDate(resource.date);

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-sm ${
        featured ? "md:grid md:grid-cols-[1fr_1.1fr]" : ""
      }`}
    >
      {resource.image && (
        <div
          className={`relative overflow-hidden bg-green-50 ${
            featured ? "min-h-64 md:min-h-full" : "h-52"
          }`}
        >
          <Image
            src={resource.image}
            alt={resource.title}
            fill
            unoptimized
            sizes={featured ? "(min-width: 768px) 45vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
            className="object-cover"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </div>
      )}

      <div
        className={`flex flex-1 flex-col p-6 sm:p-8 ${
          featured ? "justify-center md:p-10" : ""
        }`}
      >
        <div className="mb-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
            {categoryLabels[resource.category]}
          </span>
          {resource.source === "external" && (
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              External resource
            </span>
          )}
          {date && (
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar size={13} aria-hidden="true" />
              <time dateTime={resource.date}>{date}</time>
            </span>
          )}
        </div>

        <h3
          className={`font-serif font-bold tracking-tight text-slate-900 ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
        >
          {resource.title}
        </h3>
        <p
          className={`mt-3 leading-relaxed text-slate-600 ${
            featured ? "text-base sm:text-lg" : "text-sm"
          }`}
        >
          {resource.description}
        </p>

        {(resource.author || resource.tags.length > 0) && (
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
            {resource.author && (
              <span>
                {resource.source === "external" ? "Source" : "By"}{" "}
                <span className="font-medium text-slate-700">
                  {resource.author}
                </span>
              </span>
            )}
            {resource.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-slate-50 px-2.5 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-6">
          <ResourceAction resource={resource} />
        </div>
      </div>
    </article>
  );
}

function ResourceSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 6 }, (_, index) => (
        <div
          key={index}
          className="animate-pulse overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white p-6"
        >
          <div className="h-44 rounded-2xl bg-slate-100" />
          <div className="mt-6 h-4 w-28 rounded bg-slate-100" />
          <div className="mt-4 h-6 rounded bg-slate-100" />
          <div className="mt-3 h-4 rounded bg-slate-100" />
          <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
        </div>
      ))}
    </div>
  );
}

interface BlogsClientProps {
  initialResources: Resource[];
  initialError: string | null;
}

export default function BlogsClient({
  initialResources,
  initialError,
}: BlogsClientProps) {
  const [resources, setResources] = useState(initialResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ResourceCategory
  >("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const reduceMotion = useReducedMotion();
  const requestController = useRef<AbortController | null>(null);
  const isFirstFilterRender = useRef(true);

  const fetchResources = useCallback(
    async (
      category: string,
      search: string,
      { showLoading = true }: { showLoading?: boolean } = {}
    ) => {
      requestController.current?.abort();
      const controller = new AbortController();
      requestController.current = controller;

      if (showLoading) setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ category });
        if (search.trim()) params.set("search", search.trim());

        const response = await fetch(`/api/resources?${params.toString()}`, {
          cache: "no-store",
          signal: controller.signal,
        });
        const result = (await response.json()) as {
          resources?: Resource[];
          error?: string;
        };

        if (!response.ok) {
          throw new Error(result.error ?? "Resources are temporarily unavailable.");
        }

        setResources(result.resources ?? []);
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Resources are temporarily unavailable."
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (isFirstFilterRender.current) {
      isFirstFilterRender.current = false;
      return;
    }

    const timeout = window.setTimeout(
      () => fetchResources(selectedCategory, searchQuery),
      searchQuery.trim() ? 350 : 0
    );

    return () => window.clearTimeout(timeout);
  }, [fetchResources, searchQuery, selectedCategory]);

  useEffect(
    () => () => {
      requestController.current?.abort();
    },
    []
  );

  useRealtimeRefresh([{ table: "blogs", event: "*" }], () =>
    fetchResources(selectedCategory, searchQuery, { showLoading: false })
  );

  useEffect(() => {
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") {
        void fetchResources(selectedCategory, searchQuery, {
          showLoading: false,
        });
      }
    };

    const interval = window.setInterval(
      refreshWhenVisible,
      RESOURCE_REFRESH_INTERVAL
    );
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [fetchResources, searchQuery, selectedCategory]);

  const displayedResources = useMemo(() => {
    const filtered = searchQuery.trim()
      ? resources.filter((resource) => {
          const query = searchQuery.trim().toLowerCase();
          return (
            resource.title.toLowerCase().includes(query) ||
            resource.description.toLowerCase().includes(query) ||
            resource.tags.some((tag) => tag.toLowerCase().includes(query))
          );
        })
      : resources;

    const seen = new Set<string>();
    return filtered
      .filter((resource) => {
        const key = getResourceDedupKey(resource);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort(
        (first, second) =>
          Number(second.isFeatured) - Number(first.isFeatured) ||
          new Date(second.date).getTime() - new Date(first.date).getTime()
      );
  }, [resources, searchQuery]);

  const pageCount = Math.ceil(displayedResources.length / RESOURCES_PER_PAGE);
  const pageResources = displayedResources.slice(
    (currentPage - 1) * RESOURCES_PER_PAGE,
    currentPage * RESOURCES_PER_PAGE
  );
  const featuredResource = pageResources.find(
    (resource) => resource.isFeatured
  );
  const latestResources = pageResources.filter(
    (resource) => resource.id !== featuredResource?.id
  );

  useEffect(() => {
    if (pageCount > 0 && currentPage > pageCount) {
      setCurrentPage(pageCount);
    }
  }, [currentPage, pageCount]);

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-white text-slate-900">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-10%] left-[10%]"
        />
      </div>

      <section className="relative px-6 pb-12 pt-24 sm:pb-16 sm:pt-28 lg:pt-32">
        <div className="mx-auto grid max-w-7xl items-end gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.16em] text-green-700 uppercase">
              <Newspaper size={14} aria-hidden="true" />
              EaziWage insights
            </div>
            <motion.h1
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.45 }}
              className="max-w-3xl font-serif text-4xl leading-tight font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl"
            >
              Ideas for a more financially confident workforce.
            </motion.h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Explore earned wage access, employee financial wellness, payroll
              innovation, and financial inclusion across African markets.
            </p>
          </div>

          <div className="w-full lg:pb-1">
            <label
              htmlFor="resource-search"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Search EaziWage resources
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400"
              />
              <Input
                id="resource-search"
                type="search"
                placeholder="Search guides, insights, and more"
                value={searchQuery}
                onChange={(event) => {
                  setSearchQuery(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-14 rounded-2xl border-slate-200 bg-white pl-12 text-base shadow-sm focus:border-green-600 focus:ring-green-600/15"
              />
              {isLoading && (
                <LoaderCircle
                  aria-label="Updating results"
                  role="status"
                  size={19}
                  className="absolute top-1/2 right-4 -translate-y-1/2 animate-spin text-green-700 motion-reduce:animate-none"
                />
              )}
            </div>
          </div>
        </div>
      </section>

      <nav
        aria-label="Filter resources by category"
        className="relative z-10 border-y border-slate-100 bg-white/90 py-4 backdrop-blur-sm"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 pb-1">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              aria-pressed={selectedCategory === category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentPage(1);
              }}
              className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 ${
                selectedCategory === category.id
                  ? "bg-green-700 text-white"
                  : "border border-slate-200 bg-white text-slate-600 hover:border-green-600/50 hover:text-green-800"
              }`}
            >
              <category.icon size={16} aria-hidden="true" />
              {category.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="relative z-10 mx-auto max-w-7xl px-6">
        {error && (
          <div
            role="alert"
            className="mt-8 flex flex-wrap items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800"
          >
            <AlertCircle size={19} aria-hidden="true" />
            <p className="flex-1">{error}</p>
            <button
              type="button"
              onClick={() =>
                fetchResources(selectedCategory, searchQuery)
              }
              className="min-h-10 rounded-lg px-3 font-semibold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-800"
            >
              Retry
            </button>
          </div>
        )}

        {featuredResource && (
          <section aria-labelledby="featured-heading" className="py-12 sm:py-16">
            <h2
              id="featured-heading"
              className="mb-5 font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
            >
              Featured
            </h2>
            <TiltCard className="rounded-[2rem] shadow-lg shadow-green-900/5 transition-shadow hover:shadow-xl hover:shadow-green-900/10">
              <ResourceCard resource={featuredResource} featured />
            </TiltCard>
          </section>
        )}

        <section
          aria-labelledby="latest-heading"
          aria-busy={isLoading}
          className="py-12 sm:py-16"
        >
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2
                id="latest-heading"
                className="font-serif text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
              >
                {searchQuery.trim() ? "Search results" : "Latest resources"}
              </h2>
              {searchQuery.trim() && (
                <p className="mt-2 text-sm text-slate-600">
                  Results for <span className="font-semibold">“{searchQuery.trim()}”</span>
                </p>
              )}
            </div>
            <p className="text-sm text-slate-500" aria-live="polite">
              {displayedResources.length}{" "}
              {displayedResources.length === 1 ? "resource" : "resources"}
            </p>
          </div>

          {isLoading && resources.length === 0 ? (
            <ResourceSkeleton />
          ) : latestResources.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latestResources.map((resource) => (
                <ResourceCard key={getResourceDedupKey(resource)} resource={resource} />
              ))}
            </div>
          ) : !featuredResource && !error && !isLoading ? (
            <div
              role="status"
              className="rounded-[2rem] border border-slate-200/70 bg-slate-50/70 px-6 py-16 text-center"
            >
              <Search
                aria-hidden="true"
                className="mx-auto h-9 w-9 text-green-700"
              />
              <h3 className="mt-4 font-serif text-2xl font-bold text-slate-900">
                No resources found
              </h3>
              <p className="mt-2 text-slate-600">
                Try another search or choose a different category.
              </p>
            </div>
          ) : null}
        </section>

        {!isLoading && pageCount > 1 && (
          <nav
            aria-label="Resource pages"
            className="flex items-center justify-center gap-4 border-t border-slate-100 py-8"
          >
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-green-700 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight size={15} aria-hidden="true" className="rotate-180" />
              Previous
            </button>
            <p aria-live="polite" className="text-sm text-slate-600">
              Page <span className="font-semibold text-slate-900">{currentPage}</span> of{" "}
              <span className="font-semibold text-slate-900">{pageCount}</span>
            </p>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) => Math.min(pageCount, page + 1))
              }
              disabled={currentPage === pageCount}
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition-colors hover:border-green-700 hover:text-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ArrowRight size={15} aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>

    </main>
  );
}
