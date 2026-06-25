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
  bgColor = "#f6f9fc",
  showLogo = true,
  logoWidth = 140,
  logoHeight = "auto",
  logoAlt = "EaziWage",
  showFooter = true,
  footerContent,
  showBorder = true,
  containerPadding = "0 0 48px",
  containerMarginBottom = "64px",
  containerBorderRadius = "12px",
  containerBorder = "1px solid #e5e7eb",
  headerPadding = "32px 48px",
  contentPadding = "32px 48px",
  footerPadding = "32px 48px",
  showBorderBottom = true,
  showBorderTop = true,
}: EmailLayoutProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com";

  const main = {
    backgroundColor: bgColor,
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  };

  const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: containerPadding,
    marginBottom: containerMarginBottom,
    maxWidth: "600px",
    borderRadius: containerBorderRadius,
    overflow: "hidden",
    border: showBorder ? containerBorder : undefined,
  };

  const header = {
    padding: headerPadding,
    backgroundColor: "#ffffff",
    borderBottom: showBorderBottom ? "1px solid #f3f4f6" : undefined,
  };

  const logo = {
    margin: "0 auto",
  };

  const content = {
    padding: contentPadding,
  };

  const footer = {
    borderTop: showBorderTop ? "1px solid #f3f4f6" : undefined,
    padding: footerPadding,
    textAlign: "center" as const,
    backgroundColor: "#f9fafb",
  };

  const footerText = {
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: "1.5",
    margin: "4px 0",
  };

  const footerLink = {
    color: "#16a34a",
    textDecoration: "none",
    fontWeight: "600",
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            {showLogo && (
              <Img
                src={`/logo.png`}
                width={logoWidth}
                height={logoHeight}
                alt={logoAlt}
                style={logo}
              />
            )}
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          {showFooter && (
            <Section style={footer}>
              {footerContent || (
                <>
                  <Text style={footerText}>
                    © 2026 EaziWage. Empowering Africa's workforce.
                  </Text>
                  <Text style={footerText}>
                    <Link href={baseUrl} style={footerLink}>
                      Website
                    </Link>{" "}
                    •{" "}
                    <Link href={`${baseUrl}/data.pdf`} style={footerLink}>
                      Privacy Policy
                    </Link>{" "}
                    •{" "}
                    <Link href={`${baseUrl}/terms.pdf`} style={footerLink}>
                      Terms of Service
                    </Link>{" "}
                    •{" "}
                    <Link href={`${baseUrl}/unsubscribe`} style={footerLink}>
                      Unsubscribe
                    </Link>
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