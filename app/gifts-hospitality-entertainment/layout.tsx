import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EaziWage Gifts, Hospitality & Entertainment Policy",
  description:
    "Read EaziWage's policy on giving, receiving, and recording gifts, hospitality, and entertainment.",
  openGraph: {
    title: "EaziWage Gifts, Hospitality & Entertainment Policy",
    description:
      "Learn EaziWage's standards for giving, receiving, and recording gifts, hospitality, and entertainment.",
  },
};

export default function GiftsHospitalityEntertainmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
