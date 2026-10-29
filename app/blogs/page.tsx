import type { Metadata } from "next";
import { Suspense } from "react";
import BlogsClient from "./BlogsClient";
import { Resource } from "@/types/resources";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Guides, insights, and the latest news on Earned Wage Access and financial wellness across Africa.",
  openGraph: {
    title: "EaziWage Resources — Guides & Insights on Earned Wage Access",
    description:
      "Practical guides, product updates, and financial wellness insights for employers and employees across Kenya, Uganda, Tanzania and Rwanda.",
  },
};

interface InitialResources {
  resources: Resource[];
  error: string | null;
  discoveryUnavailable: boolean;
}

async function fetchResources(category = "all"): Promise<InitialResources> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://eaziwage.com";

    const res = await fetch(`${baseUrl}/api/resources?category=${category}`, {
      cache: "no-store",
    });

    const data = (await res.json()) as {
      resources?: Resource[];
      error?: string;
      discoveryUnavailable?: boolean;
    };

    if (!res.ok) {
      return {
        resources: [],
        error: data.error ?? "Resources are temporarily unavailable.",
        discoveryUnavailable: false,
      };
    }

    return {
      resources: data.resources ?? [],
      error: null,
      discoveryUnavailable: data.discoveryUnavailable ?? false,
    };
  } catch (err) {
    console.error("Failed to prefetch resources:", err);
    return {
      resources: [],
      error: "Resources are temporarily unavailable.",
      discoveryUnavailable: false,
    };
  }
}

export default async function ResourcesPage() {
  const initial = await fetchResources("all");

  return (
    <Suspense fallback={null}>
      <BlogsClient
        initialResources={initial.resources}
        initialError={initial.error}
        initialDiscoveryUnavailable={initial.discoveryUnavailable}
      />
    </Suspense>
  );
}
