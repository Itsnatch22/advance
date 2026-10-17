import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaziWage Anti-Bribery and Corruption Policy",
  description:
    "Read EaziWage's Anti-Bribery and Corruption Policy and its standards for preventing and reporting bribery and corruption.",
  openGraph: {
    title: "EaziWage Anti-Bribery and Corruption Policy",
    description:
      "Learn about EaziWage's standards for preventing and reporting bribery and corruption.",
  },
};

export default function AntibriberyCorruptionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
