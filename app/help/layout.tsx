import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help Center",
  description:
    "Get support for common payroll, verification, and payout issues in the EaziWage Help Center.",
};

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}