import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaziWage Data Privacy & Protection Policy",
  description:
    "Learn how EaziWage collects, uses, shares, stores, and protects personal data when providing earned-wage access and related services.",
  openGraph: {
    title: "EaziWage Data Privacy & Protection Policy",
    description:
      "Learn how EaziWage handles and protects personal data when providing earned-wage access and related services.",
  },
};

export default function DataPrivacyProtectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
