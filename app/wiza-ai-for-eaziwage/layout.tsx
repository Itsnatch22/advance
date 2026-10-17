import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wiza AI",
  description:
    "Learn about Wiza AI, EaziWage's AI-powered assistant for helping employees get answers and support.",
  openGraph: {
    title: "Wiza AI — EaziWage's AI Assistant",
    description:
      "Discover Wiza AI, EaziWage's assistant for helping employees get answers and support.",
  },
};

export default function WizaAiForEaziwageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
