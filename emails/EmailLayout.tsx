import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Img,
} from "@react-email/components";
import type { ReactNode } from "react";
import { EMAIL_CONFIG, COMPANY_CONFIG } from '@/constants/config';

export interface FooterLink {
  label: string;
  href: string;
}

interface EmailLayoutProps {
  previewText: string;
  children: ReactNode;
  bgColor?: string;
  showLogo?: boolean;
  logoWidth?: number | string;
  logoHeight?: number | string;
  logoAlt?: string;
  showFooter?: boolean;
  footerContent?: ReactNode;
  /** Links shown in the footer, in order. Defaults to Website / Security / Unsubscribe. Pass [] to hide the row entirely. */
  footerLinks?: FooterLink[];
  showBorder?: boolean;
  containerPadding?: string;
  containerMarginBottom?: string;
  containerBorderRadius?: string;
  containerBorder?: string;
  headerPadding?: string;
  contentPadding?: string;
  footerPadding?: string;
  showBorderBottom?: boolean;
  showBorderTop?: boolean;
}

const DEFAULT_FOOTER_LINKS: FooterLink[] = [
  { label: "Website", href: "" },
  { label: "Security", href: "/security" },
  { label: "Unsubscribe", href: "/unsubscribe" },
];

export default function EmailLayout({
  previewText,
  children,
  bgColor = "#f1f5f4",
  showLogo = true,
  logoWidth = 132,
  logoHeight = "auto",
  logoAlt = "EaziWage",
  showFooter = true,
  footerContent,
  footerLinks,
  showBorder = true,
  containerPadding = "0 0 8px",
  containerMarginBottom = "64px",
  containerBorderRadius = "28px",
  containerBorder = "1px solid #e6ebe9",
  headerPadding = "36px 48px 28px",
  contentPadding = "8px 48px 32px",
  footerPadding = "32px 48px 40px",
  showBorderBottom = true,
  showBorderTop = true,
}: EmailLayoutProps) {
  const baseUrl = COMPANY_CONFIG.HOMEPAGE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com";
  const links = (footerLinks ?? DEFAULT_FOOTER_LINKS).map((l) => ({
    ...l,
    href: l.href ? (l.href.startsWith("http") ? l.href : `${baseUrl}${l.href.startsWith("/") ? "" : "/"}${l.href}`) : baseUrl,
  }));

  const main = {
    backgroundColor: bgColor,
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",sans-serif',
  };

  const accentBar = {
    height: "4px",
    lineHeight: "4px",
    fontSize: "0",
    backgroundColor: "#059669",
    backgroundImage: "linear-gradient(90deg, #00B37E 0%, #059669 45%, #006F42 100%)",
  };

  const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: containerPadding,
    marginBottom: containerMarginBottom,
    maxWidth: "600px",
    borderRadius: containerBorderRadius,
    overflow: "hidden" as const,
    border: showBorder ? containerBorder : undefined,
    boxShadow: "0 24px 48px -18px rgba(5, 100, 70, 0.16), 0 1px 2px rgba(15, 23, 42, 0.04)",
  };

  const header = {
    padding: headerPadding,
    backgroundColor: "#ffffff",
    borderBottom: showBorderBottom ? "1px solid #eef2f0" : undefined,
    textAlign: "center" as const,
  };

  const logo = {
    margin: "0 auto",
    display: "block",
  };

  const badge = {
    display: "inline-block",
    margin: "14px 0 0",
    padding: "5px 14px",
    borderRadius: "999px",
    backgroundColor: "#ecfdf5",
    border: "1px solid #bbf7d0",
    color: "#059669",
    fontSize: "11px",
    fontWeight: "700",
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
  };

  const content = {
    padding: contentPadding,
  };

  const footer = {
    borderTop: showBorderTop ? "1px solid #eef2f0" : undefined,
    padding: footerPadding,
    textAlign: "center" as const,
    backgroundColor: "#f9fbfa",
  };

  const footerWordmark = {
    color: "#0f172a",
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "-0.01em",
    margin: "0 0 4px",
    fontFamily: 'Georgia, "Times New Roman", serif',
  };

  const footerTagline = {
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "0 0 18px",
  };

  const footerLinksRow = {
    color: "#94a3b8",
    fontSize: "13px",
    lineHeight: "1.8",
    margin: "0 0 14px",
  };

  const footerLink = {
    color: "#059669",
    textDecoration: "none",
    fontWeight: "600",
  };

  const footerMeta = {
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: "1.6",
    margin: "0",
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <div style={accentBar}>&nbsp;</div>

          {/* Header with Logo */}
          {showLogo && (
            <Section style={header}>
              <Img
                src={`${baseUrl}/logo.png`}
                width={logoWidth}
                height={logoHeight}
                alt={logoAlt}
                style={logo}
              />
              <div style={badge}>Earned Wage Access</div>
            </Section>
          )}

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          {showFooter && (
            <Section style={footer}>
              {footerContent ?? (
                <>
                  <Text style={footerWordmark}>EaziWage</Text>
                  <Text style={footerTagline}>Empowering Africa&apos;s Workforce</Text>

                  {links.length > 0 && (
                    <Text style={footerLinksRow}>
                      {links.map((l, i) => (
                        <span key={l.label}>
                          {i > 0 && <span style={{ color: "#cbd5e1" }}> &middot; </span>}
                          <Link href={l.href} style={footerLink}>
                            {l.label}
                          </Link>
                        </span>
                      ))}
                    </Text>
                  )}

                  <Text style={footerMeta}>
                    Nairobi, Kenya &middot; {EMAIL_CONFIG.SUPPORT_EMAIL}
                    <br />
                    &copy; {new Date().getFullYear()} EaziWage. All rights reserved.
                  </Text>
                </>
              )}
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  );
}
