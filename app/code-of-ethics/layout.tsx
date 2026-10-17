import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaziWage Code of Ethics and Business Conduct",
  description:
    "Read EaziWage's Code of Ethics and Business Conduct, including the standards expected of employees and associated persons.",
  openGraph: {
    title: "EaziWage Code of Ethics and Business Conduct",
    description:
      "Review the ethical principles and professional standards expected of EaziWage employees and associated persons.",
  },
};

export default function CodeOfEthicsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
