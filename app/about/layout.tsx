import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn how EaziWage is empowering Africa's workforce with instant access to earned wages — fairly, securely, and transparently.",
  openGraph: {
    title: "About EaziWage — Africa's Earned Wage Access Platform",
    description:
      "Our mission is to break the cycle of financial stress for workers across Kenya, Uganda, Tanzania and Rwanda by giving them access to money they've already earned.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
