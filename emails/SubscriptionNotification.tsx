// emails/SubscriptionNotification.tsx
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface SubscriptionNotificationProps {
  email: string;
}

export const SubscriptionNotification = ({
  email,
}: SubscriptionNotificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to EaziWage Newsletter - Your Financial Freedom Journey Starts Here</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo Section */}
          <Section style={logoSection}>
            <Img
              src="https://eaziwage.com/logo.png"
              width="150"
              height="50"
              alt="EaziWage"
              style={logo}
            />
          </Section>

          {/* Hero Section */}
          <Section style={heroSection}>
            <Heading style={heading}>Welcome to EaziWage! 🎉</Heading>
            <Text style={paragraph}>
              Thank you for subscribing to our newsletter! We're thrilled to have you as part of the EaziWage community.
            </Text>
          </Section>

          {/* Content Section */}
          <Section style={contentSection}>
            <Text style={subheading}>What to Expect:</Text>
            <Text style={listItem}>✅ Latest product updates and features</Text>
            <Text style={listItem}>💡 Financial wellness tips and insights</Text>
            <Text style={listItem}>📊 Industry trends and earned wage access news</Text>
            <Text style={listItem}>🎁 Exclusive offers and early access</Text>
          </Section>

          {/* CTA Section */}
          <Section style={ctaSection}>
            <Button style={button} href="https://eaziwage.com">
              Explore EaziWage
            </Button>
          </Section>

          {/* Footer Section */}
          <Section style={footerSection}>
            <Text style={footerText}>
              You're receiving this email because you subscribed to EaziWage newsletter at {email}.
            </Text>
            <Text style={footerText}>
              <Link href="https://eaziwage.com/unsubscribe" style={link}>
                Unsubscribe
              </Link>
              {" | "}
              <Link href="https://eaziwage.com" style={link}>
                Visit Website
              </Link>
              {" | "}
              <Link href="https://eaziwage.com/contact" style={link}>
                Contact Us
              </Link>
            </Text>
            <Text style={footerText}>
              © 2025 EaziWage. All rights reserved.
            </Text>
            <Text style={footerText}>
              Nairobi, Kenya
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const logoSection = {
  padding: "32px 48px",
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto",
};

const heroSection = {
  padding: "0 48px 32px",
  textAlign: "center" as const,
  borderBottom: "1px solid #e5e7eb",
};

const heading = {
  fontSize: "32px",
  lineHeight: "1.3",
  fontWeight: "700",
  color: "#10b981",
  margin: "0 0 16px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#374151",
  margin: "0",
};

const contentSection = {
  padding: "32px 48px",
  backgroundColor: "#f9fafb",
};

const subheading = {
  fontSize: "20px",
  lineHeight: "1.4",
  fontWeight: "600",
  color: "#1f2937",
  margin: "0 0 16px",
};

const listItem = {
  fontSize: "15px",
  lineHeight: "1.6",
  color: "#4b5563",
  margin: "8px 0",
};

const ctaSection = {
  padding: "32px 48px",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#10b981",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 24px",
  width: "100%",
};

const footerSection = {
  padding: "32px 48px 0",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e7eb",
};

const footerText = {
  fontSize: "12px",
  lineHeight: "1.5",
  color: "#6b7280",
  margin: "4px 0",
};

const link = {
  color: "#10b981",
  textDecoration: "underline",
};

export default SubscriptionNotification;