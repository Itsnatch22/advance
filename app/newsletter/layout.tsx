import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Get EaziWage updates, practical financial wellbeing tips, and news from the fintech industry across Africa.",
  openGraph: {
    title: "EaziWage Newsletter",
    description:
      "Get EaziWage updates, financial wellbeing tips, and fintech news from across Africa.",
  },
};

export default function NewsletterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
