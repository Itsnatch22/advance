import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the team building Africa's most trusted workplace finance platform. We're hiring engineers, designers, growth hackers, and creators.",
  openGraph: {
    title: "Careers at EaziWage - Build Fintech That Matters",
    description:
      "Ship fast, own your work, and help millions of African workers access their money on demand. Small team, real impact.",
  },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
