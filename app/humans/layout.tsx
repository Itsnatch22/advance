import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Humans",
  description:
    "Meet the people behind EaziWage and learn more about the team building earned wage access for African workplaces.",
};

export default function HumansLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}