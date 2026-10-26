import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security",
  description:
    "Learn how EaziWage uses encryption, access controls, and operational safeguards to help protect customer information.",
  openGraph: {
    title: "Security & Trust | EaziWage",
    description:
      "Explore EaziWage's security measures, data protection practices, and privacy commitment.",
  },
};

export default function SecurityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
