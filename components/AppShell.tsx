"use client";

import { usePathname } from "next/navigation";
import { Analytics } from "@vercel/analytics/next";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Toploader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import WizaChat from "@/components/WizaChat";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";

export default function AppShell({
  children,
  analyticsConsent,
}: {
  children: React.ReactNode;
  analyticsConsent: boolean;
}) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname === "/admin" || pathname?.startsWith("/admin/") === true;

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <KeyboardShortcuts />
      <Toaster position="top-center" />
      <Toploader color="#16a34a" />
      <Navbar />
      {children}
      <CookieBanner />
      {analyticsConsent ? <Analytics /> : null}
      <WizaChat />
      <Footer />
    </>
  );
}
