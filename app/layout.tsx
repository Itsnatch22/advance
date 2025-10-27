import type { Metadata } from "next";
import { IBM_Plex_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Toploader from "nextjs-toploader"
import Noah from "@/components/Noah";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  title: "EaziWage - Earned Wage Access for Kenyan Employees",
  description: "A system designed to enable employees to get access to an advance before payday.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${ibmPlexMono.variable} ${playfairDisplay.variable} antialiased`}
      >
        <Toploader
        color="#16a34a"
        />
        <ThemeProvider>
        <Navbar/>
        {children}
        <Noah/>
        <Footer/>
        </ThemeProvider>
      </body>
    </html>
  );
}
