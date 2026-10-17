import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Culture",
  description:
    "Discover the people, values, and culture behind EaziWage's mission to improve financial wellbeing across Africa.",
  openGraph: {
    title: "EaziWage Culture — People and Values",
    description:
      "Meet the people and values behind EaziWage's mission to improve financial wellbeing across Africa.",
  },
};

export default function CultureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
