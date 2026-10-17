import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talk to Sales",
  description:
    "Contact the EaziWage team to discuss earned wage access for your organization and its employees.",
  openGraph: {
    title: "Talk to EaziWage Sales",
    description:
      "Discuss earned wage access and how EaziWage can support your organization and its employees.",
  },
};

export default function SalesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
