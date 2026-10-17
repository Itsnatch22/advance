import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manage Email Preferences",
  description:
    "Update your EaziWage email preferences or unsubscribe from marketing communications.",
  openGraph: {
    title: "Manage EaziWage Email Preferences",
    description:
      "Update your email preferences or unsubscribe from EaziWage marketing communications.",
  },
};

export default function UnsubscribeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
