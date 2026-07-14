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
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
import { COOKIE_CONSENT_NAME, parseConsentValue } from "@/lib/consent";

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
  title: {
    default: "EaziWage - Earned Wage Access for Employees Across Africa",
    template: "%s | EaziWage",
  },
  description:
    "EaziWage lets employees access up to 60% of earned wages instantly — no loans, no interest. Built for employers across Kenya, Uganda, Tanzania and Rwanda.",
  metadataBase: new URL("https://eaziwage.com"),
  openGraph: {
    type: "website",
    siteName: "EaziWage",
    title: "EaziWage - Earned Wage Access for Employees Across Africa",
    description:
      "EaziWage lets employees access up to 60% of earned wages instantly — no loans, no interest. Built for employers across Kenya, Uganda, Tanzania and Rwanda.",
    url: "https://eaziwage.com",
    images: [
      {
        url: "/cta.jpg",
        width: 1200,
        height: 630,
        alt: "EaziWage — Earned Wage Access",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "EaziWage - Earned Wage Access for Employees Across Africa",
    description:
      "EaziWage lets employees access up to 60% of earned wages instantly — no loans, no interest.",
    images: ["/cta.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "en-ke";
  const consent = parseConsentValue(cookieStore.get(COOKIE_CONSENT_NAME)?.value);
  const analyticsConsent = consent?.analytics === true;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <KeyboardShortcuts />
        <CurrencyProvider locale={locale}>
          <Toaster position="top-center" />
          <Toploader color="#16a34a" />
          <Navbar />
          {children}
          <CookieBanner />
          {analyticsConsent ? <Analytics /> : null}
          <WizaChat />
          <Footer />
        </CurrencyProvider>
      </body>
    </html>
  );
}
