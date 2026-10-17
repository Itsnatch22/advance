import type { Metadata } from "next";

export const metadata: Metadata = {
  title:
    "EaziWage Anti-Money Laundering (AML) and Countering the Financing of Terrorism (CFT) Policy",
  description:
    "Learn about EaziWage's Anti-Money Laundering (AML) and Countering the Financing of Terrorism (CFT) Policy, which outlines our commitment to preventing financial crimes and ensuring compliance with Kenyan laws and regulations.",
  openGraph: {
    title: "EaziWage AML & CFT Policy",
    description:
      "Learn about EaziWage's AML and CFT policy and our commitment to preventing financial crimes and complying with Kenyan laws and regulations.",
  },
};

export default function AmlCftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
