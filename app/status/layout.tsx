import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "System Status",
  description:
    "Check the current availability of EaziWage services and view recent service incidents.",
  openGraph: {
    title: "EaziWage System Status",
    description:
      "View current EaziWage service availability and recent service incidents.",
  },
};

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
