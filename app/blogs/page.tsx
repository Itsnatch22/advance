import { Suspense } from "react";
import BlogsClient from "./BlogsClient";
import { Resource } from "@/types/resources";

export const revalidate = 3600;

export const metadata = {
  title: "Resources | EaziWage",
  description:
    "Guides, insights, and the latest news on Earned Wage Access and financial wellness across Africa.",
};

async function fetchResources(category = "all"): Promise<Resource[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://eaziwage.com";

    const res = await fetch(`${baseUrl}/api/resources?category=${category}`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return [];

    const data = (await res.json()) as { resources?: Resource[] };
    return data.resources ?? [];
  } catch (err) {
    console.error("Failed to prefetch resources:", err);
    return [];
  }
}

export default async function ResourcesPage() {
  const initialResources = await fetchResources("all");

  return (
    <Suspense fallback={null}>
      <BlogsClient initialResources={initialResources} />
    </Suspense>
  );
}
