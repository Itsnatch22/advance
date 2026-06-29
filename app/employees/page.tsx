import type { Metadata } from "next";
import EmployeesClient from "./EmployeesClient";

export const metadata: Metadata = {
  title: "For Employees",
  description:
    "Access up to 60% of your earned wages before payday — no loans, no interest. EaziWage puts your money in your hands the moment you need it.",
  openGraph: {
    title: "EaziWage for Employees — Access Your Earned Wages Instantly",
    description:
      "No loans. No interest. Just early access to the wages you've already earned, delivered instantly via mobile money or bank across Africa.",
  },
};

export default function EmployeesPage() {
  return <EmployeesClient />;
}
