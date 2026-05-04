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
  link?: string | null;
  title: string;
  date: string;
  category: ResourceCategory;
  image?: string | null;
  readTime?: string;
  description: string;
  metrics?: ResourceMetric[];
  author?: string;
  tags: string[];
}