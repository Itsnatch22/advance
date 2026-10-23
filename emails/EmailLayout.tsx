import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { COMPANY_CONFIG, EMAIL_CONFIG } from "@/constants/config";

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
  /** Links shown in the footer. Pass [] to hide the link row. */
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
  bgColor = "#f3f6f4",
  showLogo = true,
  logoWidth = 128,
  logoHeight = "auto",
  logoAlt = "EaziWage",
  showFooter = true,
  footerContent,
  footerLinks,
  showBorder = true,
  containerPadding = "0 0 0",
  containerMarginBottom = "28px",
  containerBorderRadius = "16px",
  containerBorder = "1px solid #dfe8e2",
  headerPadding = "28px 24px 22px",
  contentPadding = "8px 32px 32px",
  footerPadding = "22px 24px 26px",
  showBorderBottom = true,
  showBorderTop = true,
}: EmailLayoutProps) {
  const baseUrl = (
    COMPANY_CONFIG.HOMEPAGE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "https://eaziwage.com"
  ).replace(/\/$/, "");
  const links = (footerLinks ?? DEFAULT_FOOTER_LINKS).map((link) => ({
    ...link,
    href: link.href
      ? /^https?:\/\//i.test(link.href)
        ? link.href
        : `${baseUrl}/${link.href.replace(/^\//, "")}`
      : baseUrl,
  }));

  const bodyStyle = {
    backgroundColor: bgColor,
    color: "#33443b",
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif',
    margin: "0",
    padding: "28px 12px",
  };

  const containerStyle = {
    width: "100%",
    maxWidth: "600px",
    margin: "0 auto",
    marginBottom: containerMarginBottom,
    padding: containerPadding,
    backgroundColor: "#ffffff",
    border: showBorder ? containerBorder : "none",
    borderRadius: containerBorderRadius,
  };

  const accentStyle = {
    height: "4px",
    lineHeight: "4px",
    fontSize: "0",
    backgroundColor: "#087f5b",
  };

  const headerStyle = {
    padding: headerPadding,
    textAlign: "center" as const,
    backgroundColor: "#ffffff",
    borderBottom: showBorderBottom ? "1px solid #edf1ee" : "none",
  };

  const logoStyle = {
    display: "block",
    margin: "0 auto",
  };

  const brandNoteStyle = {
    margin: "12px 0 0",
    color: "#648174",
    fontSize: "10px",
    fontWeight: "700",
    letterSpacing: "1.6px",
    lineHeight: "1.4",
    textTransform: "uppercase" as const,
  };

  const contentStyle = {
    padding: contentPadding,
    backgroundColor: "#ffffff",
  };

  const footerStyle = {
    padding: footerPadding,
    textAlign: "center" as const,
    backgroundColor: "#f8faf8",
    borderTop: showBorderTop ? "1px solid #e8eee9" : "none",
  };

  const footerBrandStyle = {
    margin: "0 0 5px",
    color: "#18392d",
    fontSize: "14px",
    fontWeight: "700",
    lineHeight: "1.4",
  };

  const footerTaglineStyle = {
    margin: "0 0 16px",
    color: "#718278",
    fontSize: "12px",
    lineHeight: "1.5",
  };

  const footerLinksStyle = {
    margin: "0 0 14px",
    color: "#087f5b",
    fontSize: "12px",
    lineHeight: "1.8",
  };

  const footerLinkStyle = {
    color: "#087f5b",
    fontWeight: "600",
    textDecoration: "underline",
  };

  const footerMetaStyle = {
    margin: "0",
    color: "#718278",
    fontSize: "11px",
    lineHeight: "1.7",
  };

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          <Section style={accentStyle}>&nbsp;</Section>

          {showLogo ? (
            <Section style={headerStyle}>
              <Img
                src={`${baseUrl}/logo.png`}
                width={logoWidth}
                height={logoHeight}
                alt={logoAlt}
                style={logoStyle}
              />
              <Text style={brandNoteStyle}>Earned Wage Access</Text>
            </Section>
          ) : null}

          <Section style={contentStyle}>{children}</Section>

          {showFooter ? (
            <Section style={footerStyle}>
              {footerContent ?? (
                <>
                  <Text style={footerBrandStyle}>EaziWage</Text>
                  <Text style={footerTaglineStyle}>
                    Empowering Africa&apos;s Workforce
                  </Text>

                  {links.length > 0 ? (
                    <Text style={footerLinksStyle}>
                      {links.map((link, index) => (
                        <span key={link.label}>
                          {index > 0 ? (
                            <span style={{ color: "#b7c4bc" }}> &middot; </span>
                          ) : null}
                          <Link href={link.href} style={footerLinkStyle}>
                            {link.label}
                          </Link>
                        </span>
                      ))}
                    </Text>
                  ) : null}

                  <Text style={footerMetaStyle}>
                    Nairobi, Kenya &middot;{" "}
                    <Link
                      href={`mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}`}
                      style={footerLinkStyle}
                    >
                      {EMAIL_CONFIG.SUPPORT_EMAIL}
                    </Link>
                    <br />
                    &copy; {new Date().getFullYear()} EaziWage. All rights
                    reserved.
                  </Text>
                </>
              )}
            </Section>
          ) : null}
        </Container>
      </Body>
    </Html>
  );
}
