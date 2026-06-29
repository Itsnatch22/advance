import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Bank-grade infrastructure, AES-256 encryption at rest, TLS 1.3 in transit, ODPC compliance, and zero-knowledge architecture protect every EaziWage transaction.",
  openGraph: {
    title: "EaziWage Security — Bank-Grade Protection for Your Wages",
    description:
      "Multi-layered defense: AWS-hosted infrastructure, end-to-end encryption, RBAC, mandatory 2FA, and full ODPC compliance across all operating jurisdictions.",
  },
};

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
