import { Suspense } from "react";
import ResourcesClient from "./BlogsClient";
import { Resource } from "@/types/resources";

// ISR: revalidate every hour
export const revalidate = 3600;

export const metadata = {
  title: "Resources | EaziWage",
  description:
    "Guides, insights, and the latest news on Earned Wage Access and financial wellness across Africa.",
};

async function fetchResources(category = "all"): Promise<Resource[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com";

    const res = await fetch(
      `${baseUrl}/api/resources?category=${category}`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return data.resources ?? [];
  } catch (err) {
    console.error("Failed to prefetch resources:", err);
    return [];
  }
}

export default async function ResourcesPage() {
  // Prefetch "all" on the server for fast initial render
  const initialResources = await fetchResources("all");

  return (
    <Suspense fallback={null}>
      <ResourcesClient initialResources={initialResources} />
    </Suspense>
  );
}