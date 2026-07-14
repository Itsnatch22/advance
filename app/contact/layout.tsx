import type { Metadata } from "next";
import { EMAIL_CONFIG } from '@/constants/config';

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the EaziWage team for questions about earned wage access, employer partnerships, or employee support. We're available 24/7.",
  openGraph: {
  title: "Contact EaziWage — We're Here to Help",
  description: `Reach our team at ${EMAIL_CONFIG.SUPPORT_EMAIL} or call +254 723 154900. Westlands Business Park, Nairobi.`,
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
