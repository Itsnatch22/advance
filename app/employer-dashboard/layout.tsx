import DashboardLayout from "@/components/layout";
import {
  LayoutDashboard,
  Users,
  FileText,
  PieChart,
  Settings,
} from "lucide-react";

export const metadata = {
  title: "Employer Dashboard",
};

const navItems = [
  {
    label: "Dashboard",
    href: "/employer-dashboard",
    icon: <LayoutDashboard />,
  },
  {
    label: "Employees",
    href: "/employer-dashboard/employees",
    icon: <Users />,
  },
  {
    label: "Requests",
    href: "/employer-dashboard/requests",
    icon: <FileText />,
  },
  {
    label: "Analytics",
    href: "/employer-dashboard/analytics",
    icon: <PieChart />,
  },
  {
    label: "Settings",
    href: "/employer-dashboard/settings",
    icon: <Settings />,
  },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout
      navItems={navItems}
      userRole="Employer"
      userName="Acme Corp"
    >
      {children}
    </DashboardLayout>
  );
}
