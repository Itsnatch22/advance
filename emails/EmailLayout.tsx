import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Img,
} from "@react-email/components";
import type { ReactNode } from "react";
import { EMAIL_CONFIG, COMPANY_CONFIG } from '@/constants/config';

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

export default function EmailLayout({
  previewText,
  children,
  bgColor = "#f8fafc",
  showLogo = true,
  logoWidth = 140,
  logoHeight = "auto",
  logoAlt = "EaziWage",
  showFooter = true,
  footerContent,
  showBorder = true,
  containerPadding = "0 0 48px",
  containerMarginBottom = "64px",
  containerBorderRadius = "24px",
  containerBorder = "1px solid #e2e8f0",
  headerPadding = "40px 48px",
  contentPadding = "32px 48px",
  footerPadding = "40px 48px",
  showBorderBottom = true,
  showBorderTop = true,
}: EmailLayoutProps) {
  const baseUrl = COMPANY_CONFIG.HOMEPAGE_URL || process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com";

  const main = {
    backgroundColor: bgColor,
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",sans-serif',
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
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.07)",
  };

  const header = {
    padding: headerPadding,
    backgroundColor: "#ffffff",
    borderBottom: showBorderBottom ? "1px solid #e2e8f0" : undefined,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const logo = {
    margin: "0 auto",
    display: "block",
  };

  const content = {
    padding: contentPadding,
  };

  const footer = {
    borderTop: showBorderTop ? "1px solid #e2e8f0" : undefined,
    padding: footerPadding,
    textAlign: "center" as const,
    backgroundColor: "#f8fafc",
  };

  const footerText = {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.6",
    margin: "6px 0",
  };

  const footerLink = {
    color: "#15803d",
    textDecoration: "none",
    fontWeight: "600",
  };

  const divider = {
    borderTop: "1px solid #e2e8f0",
    margin: "24px 0",
  };

  const tagline = {
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.4",
    margin: "8px 0 0 0",
    fontWeight: "500",
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header with Logo */}
          {showLogo && (
            <Section style={header}>
              <div style={{ textAlign: "center" as const }}>
                <Img
                  src={`${baseUrl}/logo.png`}
                  width={logoWidth}
                  height={logoHeight}
                  alt={logoAlt}
                  style={logo}
                />
                <div style={tagline}>Empowering Africa's Workforce</div>
              </div>
            </Section>
          )}

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          {showFooter && (
            <Section style={footer}>
              {footerContent || (
                <>
                  <div style={divider} />
                  <Text style={footerText}>
                    © 2026 EaziWage. Transforming financial wellness.
                  </Text>
                  <Text style={footerText}>
                    <Link href={`${baseUrl}`} style={footerLink}>
                      Website
                    </Link>{" "}
                    •{" "}
                    <Link href={`${baseUrl}/security`} style={footerLink}>
                      Security
                    </Link>{" "}
                    •{" "}
                    <Link href={`${baseUrl}/unsubscribe`} style={footerLink}>
                      Unsubscribe
                    </Link>
                  </Text>
                  <Text style={footerText}>
                    Nairobi, Kenya · {EMAIL_CONFIG.SUPPORT_EMAIL}
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