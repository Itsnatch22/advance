import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Documentation",
  description:
    "Explore EaziWage integration guides, API documentation, and technical resources for partners and developers.",
  openGraph: {
    title: "EaziWage Developer Documentation",
    description:
      "Explore integration guides, API documentation, and technical resources for EaziWage partners and developers.",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
