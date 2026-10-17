import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaziWage Terms of Service",
  description:
    "Learn about EaziWage's Terms of Service, which outlines the rules and guidelines for using our services.",
  openGraph: {
    title: "EaziWage Terms of Service",
    description:
      "Review the terms, rules, and guidelines for using EaziWage services.",
  },
};

export default function TermsOfServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
