import type { Metadata } from "next";
import { IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Toploader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/next";
import CookieBanner from "@/components/CookieBanner";
import WizaChat from "@/components/WizaChat";
import { Toaster } from "react-hot-toast";
import { cookies } from "next/headers";
import { CurrencyProvider } from "@/components/CurrencyProvider";

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "EaziWage - Earned Wage Access for Employees Across Africa",
  description:
    "A system designed to enable employees to get access to an advance before payday.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en-ke";

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <CurrencyProvider locale={locale}>
          <Toaster position="top-center" />
          <Toploader color="#16a34a" />
          <Navbar />
          {children}
          <CookieBanner />
          <Analytics />
          <WizaChat />
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
