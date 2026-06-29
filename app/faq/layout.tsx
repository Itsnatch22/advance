import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about EaziWage earned wage access — fees, security, how advances work, employer setup, and more.",
  openGraph: {
    title: "EaziWage FAQ — Real Answers, No Support Tickets",
    description:
      "Everything you need to know about accessing your earned wages early, employer integration, security, fees, and technical setup.",
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
