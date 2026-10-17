import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Partners",
  description:
    "Meet the financial institutions and organizations working with EaziWage to bring earned wage access to employees across Africa.",
  openGraph: {
    title: "EaziWage Partners",
    description:
      "Meet the organizations working with EaziWage to bring earned wage access to employees across Africa.",
  },
};

export default function PartnersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
