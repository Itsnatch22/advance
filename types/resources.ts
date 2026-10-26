export type ResourceCategory =
  | "guide"
  | "blog"
  | "case-study"
  | "webinar"
  | "download";

export interface ResourceMetric {
  value: string;
  label: string;
}

export interface Resource {
  id: string;
  link?: string | null;
  title: string;
  date: string;
  category: ResourceCategory;
  image?: string | null;
  readTime?: string | null;
  description: string;
  metrics?: ResourceMetric[] | null;
  author?: string | null;
  tags: string[];
  isFeatured: boolean;
  source: "eaziwage" | "external";
}