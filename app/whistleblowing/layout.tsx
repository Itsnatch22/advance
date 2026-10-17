import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaziWage Whistleblowing Policy",
  description:
    "Learn about EaziWage's Whistleblowing Policy, which outlines the procedures for reporting misconduct or violations of company policies.",
  openGraph: {
    title: "EaziWage Whistleblowing Policy",
    description:
      "Learn how to report misconduct or violations of EaziWage company policies.",
  },
};

export default function WhistleblowingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
