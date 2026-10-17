import type { Metadata } from "next";

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

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
