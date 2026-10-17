import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule a Meeting",
  description:
    "Book time with the EaziWage team to discuss employee support, partner onboarding, a product demo, or a strategy session.",
  openGraph: {
    title: "Schedule a Meeting with EaziWage",
    description:
      "Book time with EaziWage for employee support, partner onboarding, a product demo, or a strategy session.",
  },
};

export default function ScheduleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
