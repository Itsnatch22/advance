"use client";

import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import {
  Search,
  Download,
  Calendar,
  TrendingUp,
  FileText,
  Clock,
  Users,
  Layers,
  Video,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Newspaper,
  RefreshCw,
} from "lucide-react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Resource, ResourceCategory } from "@/types/resources";
import { FloatingOrb } from "@/components/shared/FloatingOrb";
import { useParallax } from "@/hooks/use-parallax";
import { BorderBeam } from "@/components/ui/border-beam";
import { useRealtimeRefresh } from "@/hooks/useRealtimeRefresh";

interface CategoryOption {
  id: "all" | ResourceCategory;
  label: string;
  icon: React.ElementType;
}

const categories: CategoryOption[] = [
  { id: "all", label: "All EWA Content", icon: Layers },
  { id: "guide", label: "Implementation Guides", icon: FileText },
  { id: "blog", label: "EWA Insights", icon: TrendingUp },
  { id: "case-study", label: "Success Stories", icon: Users },
  { id: "webinar", label: "EWA Events", icon: Video },
  { id: "download", label: "EWA Tools", icon: Download },
];

const categoryColors: Record<ResourceCategory, string> = {
  guide: "bg-blue-50 text-blue-600 border-blue-100",
  blog: "bg-purple-50 text-purple-600 border-purple-100",
  "case-study": "bg-emerald-50 text-emerald-600 border-emerald-100",
  webinar: "bg-orange-50 text-orange-600 border-orange-100",
  download: "bg-indigo-50 text-indigo-600 border-indigo-100",
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

const SkeletonCard = () => (
  <div className="relative flex h-full animate-pulse flex-col overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl">
    <div className="mb-6 flex items-center justify-between">
      <div className="h-5 w-20 rounded-xl bg-slate-100" />
      <div className="h-4 w-24 rounded-lg bg-slate-100" />
    </div>
    <div className="mb-4 space-y-2">
      <div className="h-6 w-full rounded-lg bg-slate-100" />
      <div className="h-6 w-3/4 rounded-lg bg-slate-100" />
    </div>
    <div className="mb-8 h-32 w-full rounded-2xl bg-slate-100" />
    <div className="space-y-2">
      <div className="h-4 w-full rounded bg-slate-100" />
      <div className="h-4 w-5/6 rounded bg-slate-100" />
      <div className="h-4 w-4/6 rounded bg-slate-100" />
    </div>
    <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
      <div className="flex gap-2">
        <div className="h-3 w-12 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
      <div className="h-4 w-20 rounded bg-slate-100" />
    </div>
  </div>
);

interface TiltResourceCardProps {
  resource: Resource;
}

const TiltResourceCard = ({ resource }: TiltResourceCardProps) => {
  const {
    rotateX,
    rotateY,
    spotlightBackground,
    handleMouseMove,
    handleMouseLeave,
  } = useParallax();

  return (
    <motion.div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      >
        {/* Radial glow that follows the cursor */}
        <motion.div
          style={{
            background: spotlightBackground,
          }}
          className="pointer-events-none absolute inset-0 rounded-[2.5rem]"
        />

        <div className="relative z-10 flex h-full flex-col">
          {/* Cover image */}
          {resource.image && (
            <div className="relative -mx-8 -mt-8 mb-6 h-44 overflow-hidden rounded-t-[2.5rem]">
              <Image
                src={resource.image}
                alt={resource.title}
                fill
                unoptimized
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/20" />
            </div>
          )}

          {/* Category badge + date/read-time */}
          <div className="mb-6 flex items-center justify-between">
            <div
              className={`rounded-xl border px-3 py-1 text-[10px] font-black tracking-widest uppercase ${
                categoryColors[resource.category]
              }`}
            >
              {resource.category.replace("-", " ")}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(resource.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {resource.readTime && (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  {resource.readTime}
                </span>
              )}
            </div>
          </div>

          <h3 className="mb-4 line-clamp-3 font-serif text-xl leading-tight font-bold text-slate-900 transition-colors group-hover:text-green-600">
            {resource.title}
          </h3>

          <p className="mb-8 line-clamp-3 text-sm leading-relaxed text-slate-500">
            {resource.description}
          </p>

          {/* Optional metrics grid */}
          {resource.metrics && resource.metrics.length > 0 && (
            <div className="mb-8 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              {resource.metrics.map((m, i) => (
                <div key={i} className="text-center">
                  <div className="text-lg font-black text-green-600">
                    {m.value}
                  </div>
                  <div className="text-[8px] font-black tracking-widest text-slate-400 uppercase">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {resource.author && (
            <p className="mb-4 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
              By {resource.author}
            </p>
          )}

          {/* Footer: tags + read link */}
          <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-6">
            <div className="flex flex-wrap gap-2">
              {resource.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold text-slate-400"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <a
              href={resource.link ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-black tracking-widest text-green-600 uppercase transition-all group-hover:gap-3"
            >
              Read
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Bottom progress bar on hover */}
        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

interface BlogsClientProps {
  initialResources: Resource[];
}

export default function BlogsClient({ initialResources }: BlogsClientProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | ResourceCategory
  >("all");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(new Date());

  const [email, setEmail] = useState<string>("");
  const [honeypot, setHoneypot] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const containerRef = useRef<HTMLElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const yHero = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacityHero = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const fetchResources = useCallback(
    async (category: string, search: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({ category });
        if (search.trim()) params.set("search", search.trim());

        const res = await fetch(`/api/resources?${params.toString()}`);
        const rawText = await res.text();

        if (!rawText) {
          throw new Error(`Empty response from server (status ${res.status})`);
        }

        let parsed: { resources?: Resource[]; error?: string };
        try {
          parsed = JSON.parse(rawText);
        } catch {
          throw new Error(`Invalid response from server (status ${res.status})`);
        }

        if (!res.ok) {
          throw new Error(parsed.error ?? "Failed to fetch");
        }

        setResources(parsed.resources ?? []);
        setLastFetched(new Date());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useRealtimeRefresh(
    [{ table: "blogs", event: "INSERT" }],
    () => fetchResources(selectedCategory, searchQuery)
  );

  useEffect(() => {
    fetchResources(selectedCategory, searchQuery);
  }, [selectedCategory]);

  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchResources(selectedCategory, searchQuery);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, [searchQuery]);

  const displayedResources = useMemo<Resource[]>(() => {
    const filtered = !searchQuery.trim()
      ? resources
      : resources.filter(
          (r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const seen = new Set<string>();
    return filtered.filter((resource) => {
      const key = getResourceDedupKey(resource);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [resources, searchQuery]);

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (honeypot || !email) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrorMessage("");

    try {
      const response = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, honeypot }),
      });

      const result = (await response.json()) as { error?: string };

      if (response.ok) {
        setSubmitStatus("success");
        setEmail("");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(
          result.error ?? "Failed to subscribe. Please try again."
        );
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-white text-slate-900"
    >
      {/* Immersive Background - consistent with other pages */}
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb
          color="bg-green-100"
          delay={0}
          className="top-[-10%] left-[10%]"
        />
        <FloatingOrb
          color="bg-emerald-100"
          delay={2}
          className="top-[30%] right-[5%]"
        />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      <section className="relative bg-white py-40">
        <motion.section
          style={{ y: yHero, opacity: opacityHero }}
          className="relative px-6 py-40"
        >
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase"
            >
              <Newspaper size={14} className="animate-pulse" />
              <span>Live from Africa</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-7xl lg:text-8xl"
            >
              Earned Wage Access <br />
              <span className="text-green-600">Across Africa</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 1 }}
              className="mx-auto mt-8 max-w-3xl text-xl leading-relaxed text-slate-500"
            >
              Real-time insights, implementation guides, and success stories on
              Earned Wage Access (EWA), on-demand pay, and flexible wage
              solutions across African markets.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="group mx-auto mt-16 max-w-2xl"
            >
              <div className="relative">
                <Search className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-green-600" />
                <Input
                  type="text"
                  placeholder="Search Africa fintech news..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-20 rounded-3xl border-slate-200 bg-white/80 pr-8 pl-16 text-xl shadow-2xl backdrop-blur-xl transition-all focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
                />
                {isLoading && (
                  <div className="absolute top-1/2 right-6 -translate-y-1/2">
                    <RefreshCw
                      size={20}
                      className="animate-spin text-green-600"
                    />
                  </div>
                )}
              </div>

              {lastFetched && (
                <p className="mt-3 text-xs font-medium text-slate-400">
                  Last updated{" "}
                  {lastFetched.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </motion.div>
          </div>
        </motion.section>
      </section>

      <section className="sticky top-16 z-30 border-y border-slate-100 bg-white/40 py-8 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                disabled={isLoading}
                className={`flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-black tracking-widest uppercase transition-all duration-300 disabled:opacity-50 ${
                  selectedCategory === cat.id
                    ? "scale-105 bg-slate-900 text-white shadow-xl"
                    : "border border-slate-200 bg-white text-slate-400 hover:border-green-500 hover:text-green-600"
                }`}
              >
                <cat.icon size={16} />
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-40">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-red-600"
          >
            <AlertCircle size={20} />
            <span className="text-sm font-bold">{error}</span>
            <button
              onClick={() => fetchResources(selectedCategory, searchQuery)}
              className="ml-auto text-xs font-black tracking-widest uppercase underline"
            >
              Retry
            </button>
          </motion.div>
        )}

        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              layout
              className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3"
            >
              {displayedResources.map((resource, i) => (
                <motion.div
                  key={getResourceDedupKey(resource)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}
                  className="h-full"
                >
                  <TiltResourceCard resource={resource} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!isLoading && displayedResources.length === 0 && !error && (
          <div className="py-40 text-center">
            <div className="mb-8 inline-flex rounded-full bg-slate-50 p-10 ring-1 ring-slate-100">
              <Search className="h-12 w-12 text-slate-200" />
            </div>
            <h3 className="font-serif text-3xl font-bold text-slate-900">
              No results found
            </h3>
            <p className="mt-4 text-lg text-slate-500">
              Try adjusting your search or switching categories.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-40">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-[3rem] border border-slate-200/60 bg-white p-12 text-center shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-all duration-500 hover:shadow-green-500/10 lg:p-24"
        >
          <div className="absolute inset-0 bg-linear-to-br from-green-50/20 via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10">
            <div className="mb-10 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black tracking-[0.2em] text-green-600 uppercase">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Join the Community
              </div>
            </div>

            <h2 className="mb-8 font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Join Us <span className="text-green-600">Today</span>
            </h2>
            <p className="mx-auto mb-16 max-w-2xl text-xl text-slate-500">
              Get the latest financial wellness insights and regulatory updates
              delivered straight to your inbox.
            </p>

            <AnimatePresence mode="wait">
              {submitStatus === "success" ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="mx-auto mb-8 flex max-w-md items-center justify-center gap-3 rounded-2xl border border-green-100 bg-green-50 px-8 py-4 font-bold text-green-600"
                >
                  <CheckCircle2 size={24} />
                  <span>Welcome to the community! Check your inbox.</span>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="relative mx-auto flex max-w-xl flex-col gap-4 rounded-2xl sm:flex-row"
                >
                  <BorderBeam colorFrom="#00B37E" colorTo="#006F42" size={100} duration={8} />
                  <input
                    type="text"
                    aria-hidden="true"
                    tabIndex={-1}
                    className="sr-only"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-16 rounded-2xl border-slate-200 bg-slate-50/50 px-6 text-lg focus:bg-white focus:ring-4 focus:ring-green-500/10"
                  />
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="h-16 rounded-2xl bg-slate-900 px-10 font-bold text-white shadow-2xl transition-all hover:bg-green-600 disabled:opacity-50"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </motion.button>
                </form>
              )}
            </AnimatePresence>

            {submitStatus === "error" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center justify-center gap-2 text-sm font-bold text-red-500"
              >
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
