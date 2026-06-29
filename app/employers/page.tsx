import type { Metadata } from "next";
import EmployersClient from "./EmployersClient";

export const metadata: Metadata = {
  title: "For Employers",
  description:
    "Give your workforce instant access to earned wages. Boost retention, cut absenteeism, and integrate with your existing payroll — no loans, no interest, zero balance-sheet risk.",
  openGraph: {
    title: "EaziWage for Employers — Payroll-Integrated Earned Wage Access",
    description:
      "Reduce churn and improve financial wellbeing for your team. EaziWage integrates with any payroll system across Kenya, Uganda, Tanzania and Rwanda.",
  },
};

export default function EmployersPage() {
  return <EmployersClient />;
}
