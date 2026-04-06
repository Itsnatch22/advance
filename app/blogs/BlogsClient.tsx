"use client";

import React, { useState, useMemo, useRef, MouseEvent, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
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
import { Resource } from "@/types/resources";

const categories = [
  { id: "all", label: "All Content", icon: Layers },
  { id: "guide", label: "Guides", icon: FileText },
  { id: "blog", label: "Insights", icon: TrendingUp },
  { id: "case-study", label: "Case Studies", icon: Users },
  { id: "webinar", label: "Webinars", icon: Video },
  { id: "download", label: "Tools", icon: Download },
];

function getResourceDedupKey(resource: Resource): string {
  return [
    resource.link?.trim().toLowerCase(),
    resource.title.trim().toLowerCase(),
    resource.date,
  ]
    .filter(Boolean)
    .join("::");
}

const FloatingOrb = ({
  color,
  delay,
  className,
}: {
  color: string;
  delay: number;
  className?: string;
}) => (
  <motion.div
    animate={{ y: [0, -40, 0], x: [0, 20, 0], scale: [1, 1.1, 1] }}
    transition={{
      duration: 10 + Math.random() * 5,
      repeat: Infinity,
      delay,
      ease: "easeInOut",
    }}
    className={`absolute h-125 w-125 rounded-full blur-[120px] opacity-20 ${color} ${className}`}
  />
);

// Skeleton card for loading state
const SkeletonCard = () => (
  <div className="relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl animate-pulse">
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
    <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
      <div className="flex gap-2">
        <div className="h-3 w-12 rounded bg-slate-100" />
        <div className="h-3 w-16 rounded bg-slate-100" />
      </div>
      <div className="h-4 w-20 rounded bg-slate-100" />
    </div>
  </div>
);

const TiltResourceCard = ({ resource }: { resource: Resource }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [5, -5]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5, 5]), {
    stiffness: 150,
    damping: 20,
  });

  function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width - 0.5);
    y.set((event.clientY - rect.top) / rect.height - 0.5);
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  const categoryColors = {
    guide: "bg-blue-50 text-blue-600 border-blue-100",
    blog: "bg-purple-50 text-purple-600 border-purple-100",
    "case-study": "bg-emerald-50 text-emerald-600 border-emerald-100",
    webinar: "bg-orange-50 text-orange-600 border-orange-100",
    download: "bg-indigo-50 text-indigo-600 border-indigo-100",
  };

  return (
    <motion.div style={{ perspective: 1000 }} className="h-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          x.set(0);
          y.set(0);
        }}
        style={{ rotateX, rotateY }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-slate-200/60 bg-white/40 p-8 backdrop-blur-2xl transition-shadow duration-500 hover:shadow-2xl hover:shadow-green-500/10"
      >
        <motion.div
          style={{
            background: useTransform(
              [mouseX, mouseY],
              ([mx, my]) =>
                `radial-gradient(350px circle at ${mx}px ${my}px, rgba(34, 197, 94, 0.04), transparent 80%)`
            ),
          }}
          className="absolute inset-0 pointer-events-none rounded-[2.5rem]"
        />

        <div className="relative z-10 flex h-full flex-col">
          {/* Article image if available */}
          {resource.image && (
            <div className="mb-6 -mx-8 -mt-8 h-44 overflow-hidden rounded-t-[2.5rem] relative">
              <Image
                src={resource.image}
                alt={resource.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              <div className="absolute inset-0 bg-linear-to-b from-transparent to-white/20" />
            </div>
          )}

          <div className="mb-6 flex items-center justify-between">
            <div
              className={`rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                categoryColors[resource.category]
              }`}
            >
              {resource.category.replace("-", " ")}
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
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
                  <Clock size={12} /> {resource.readTime}
                </span>
              )}
            </div>
          </div>

          <h3 className="mb-4 font-serif text-xl font-bold leading-tight text-slate-900 group-hover:text-green-700 transition-colors line-clamp-3">
            {resource.title}
          </h3>

          <p className="mb-8 text-slate-500 leading-relaxed line-clamp-3 text-sm">
            {resource.description}
          </p>

          {resource.metrics && (
            <div className="mb-8 grid grid-cols-3 gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
              {resource.metrics.map((m, i) => (
                <div key={i} className="text-center">
                  <div className="text-lg font-black text-green-600">
                    {m.value}
                  </div>
                  <div className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          )}

          {resource.author && (
            <p className="mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              By {resource.author}
            </p>
          )}

          <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-100">
            <div className="flex gap-2 flex-wrap">
              {resource.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] font-bold text-slate-400">
                  #{tag}
                </span>
              ))}
            </div>
            <a
              href={resource.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-widest text-green-600 group-hover:gap-3 transition-all"
            >
              Read
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-green-600 transition-all duration-700 group-hover:w-full" />
      </motion.div>
    </motion.div>
  );
};

interface BlogsClientProps {
  initialResources: Resource[];
}

export default function BlogsClient({
  initialResources,
}: BlogsClientProps) {
  const [resources, setResources] = useState<Resource[]>(initialResources);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetched, setLastFetched] = useState<Date | null>(new Date());

  // Newsletter state
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

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
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Failed to fetch");
        }

        const data = await res.json();
        setResources(data.resources ?? []);
        setLastFetched(new Date());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong. Try again."
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchResources(selectedCategory, searchQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // Debounce search
  useEffect(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchResources(selectedCategory, searchQuery);
    }, 500);
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Client-side filter for instant feel while API fetches
  const displayedResources = useMemo(() => {
    const filtered = !searchQuery.trim()
      ? resources
      : resources.filter(
          (r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const seen = new Set<string>();
    return filtered.filter((resource) => {
      const dedupeKey = getResourceDedupKey(resource);
      if (seen.has(dedupeKey)) return false;
      seen.add(dedupeKey);
      return true;
    });
  }, [resources, searchQuery]);

  const handleSubscribe = async (e: React.FormEvent) => {
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

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setEmail("");
        setTimeout(() => setSubmitStatus("idle"), 5000);
      } else {
        setSubmitStatus("error");
        setErrorMessage(result.error || "Failed to subscribe. Please try again.");
      }
    } catch {
      setSubmitStatus("error");
      setErrorMessage("Network error. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main ref={containerRef} className="relative min-h-screen overflow-hidden bg-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <FloatingOrb color="bg-green-100" delay={0} className="top-[-10%] left-[10%]" />
        <FloatingOrb color="bg-emerald-100" delay={2} className="top-[30%] right-[10%]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.03]" />
      </div>

      {/* Hero */}
      <motion.section
        style={{ y: yHero, opacity: opacityHero }}
        className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600"
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
            Resources for <br />
            <span className="italic text-green-600">Financial Growth</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="mt-8 max-w-3xl mx-auto text-xl leading-relaxed text-slate-500"
          >
            Live news, guides, and insights on Earned Wage Access and financial
            wellness across Africa — updated every hour.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 max-w-2xl mx-auto group"
          >
            <div className="relative">
              <Search className="absolute top-1/2 left-6 h-6 w-6 -translate-y-1/2 text-slate-400 group-focus-within:text-green-600 transition-colors" />
              <Input
                type="text"
                placeholder="Search Africa fintech news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-20 rounded-3xl border-slate-200 bg-white/80 pl-16 pr-8 text-xl shadow-2xl backdrop-blur-xl transition-all focus:border-green-500 focus:ring-4 focus:ring-green-500/10"
              />
              {isLoading && (
                <div className="absolute top-1/2 right-6 -translate-y-1/2">
                  <RefreshCw size={20} className="text-green-500 animate-spin" />
                </div>
              )}
            </div>

            {lastFetched && (
              <p className="mt-3 text-xs text-slate-400 font-medium">
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

      {/* Filters */}
      <section className="sticky top-16 z-30 bg-white/40 backdrop-blur-md border-y border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                disabled={isLoading}
                className={`flex items-center gap-3 rounded-2xl px-6 py-3 text-sm font-black uppercase tracking-widest transition-all duration-300 disabled:opacity-50
                ${
                  selectedCategory === cat.id
                    ? "bg-slate-900 text-white shadow-xl scale-105"
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

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        {/* Error state */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-6 py-4 text-red-600"
          >
            <AlertCircle size={20} />
            <span className="font-bold text-sm">{error}</span>
            <button
              onClick={() => fetchResources(selectedCategory, searchQuery)}
              className="ml-auto text-xs font-black uppercase tracking-widest underline"
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="results"
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
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
          <div className="text-center py-40">
            <div className="inline-flex p-10 rounded-full bg-slate-50 mb-8 ring-1 ring-slate-100">
              <Search className="w-12 h-12 text-slate-200" />
            </div>
            <h3 className="text-3xl font-serif font-bold text-slate-900">
              No results found
            </h3>
            <p className="text-slate-500 mt-4 text-lg">
              Try adjusting your search or switching categories.
            </p>
          </div>
        )}
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-6 py-32 lg:py-48">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-[3rem] border border-slate-200/60 bg-white p-12 text-center backdrop-blur-3xl shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-500 hover:shadow-green-500/10 lg:p-24"
        >
          <div className="absolute inset-0 bg-linear-to-br from-green-50/20 via-white/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

          <div className="relative z-10">
            <div className="mb-10 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-green-500/10 bg-green-500/5 px-4 py-1.5 text-xs font-black uppercase tracking-[0.2em] text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Join the Community
              </div>
            </div>

            <h2 className="mb-8 font-serif text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Join 10,000+{" "}
              <span className="italic text-green-600">HR Professionals</span>
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
                  className="mb-8 flex items-center justify-center gap-3 text-green-600 font-bold bg-green-50 py-4 px-8 rounded-2xl border border-green-100 mx-auto max-w-md"
                >
                  <CheckCircle2 size={24} />
                  <span>Welcome to the community! Check your inbox.</span>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleSubscribe}
                  className="relative flex flex-col sm:flex-row gap-4 max-w-xl mx-auto"
                >
                  <input
                    type="text"
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
                    className="h-16 px-10 bg-slate-900 text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-2xl disabled:opacity-50"
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
                className="mt-4 flex items-center justify-center gap-2 text-red-500 text-sm font-bold"
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
