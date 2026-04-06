export interface Resource {
  id: string;
  title: string;
  description: string;
  category: "guide" | "blog" | "case-study" | "webinar" | "download";
  image?: string;
  author?: string;
  date: string;
  readTime?: string;
  tags: string[];
  link?: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}