import  EmailLayout  from "./EmailLayout";
import { Section, Heading, Text, Button, Link} from "@react-email/components"
interface SubscriptionNotificationProps {
  email: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com";

export default function SubscriptionNotification({
  email,
}: SubscriptionNotificationProps) {
  return (
    <EmailLayout
      previewText="Welcome to the EaziWage Newsletter!"
      showBorder
      showBorderBottom
      showBorderTop
    >
      {/* Content */}
      <Section>
        <Heading style={h1}>You're Subscribed!</Heading>

        <Text style={text}>Hi, {email}</Text>

        <Text style={text}>
          Thanks for subscribing to the EaziWage newsletter. We're thrilled
          to have you on board and can't wait to share insights, updates,
          and exclusive tips for financial wellbeing.
        </Text>

        <Section style={highlightBox}>
          <Text style={highlightText}>
            <strong>Here's what to expect:</strong>
          </Text>
          <Text style={highlightText}>
            • Weekly updates on EaziWage and fintech trends
            <br />
            • Expert tips to manage your earnings smarter
            <br />
            • Invitations to events and special promotions
          </Text>
        </Section>

        <Text style={text}>
          Stay tuned for our first newsletter, landing straight in your
          inbox soon!
        </Text>

        <Button style={button} href={`${baseUrl}/newsletter`}>
          Explore Our Newsletter
        </Button>

        <Text style={text}>
          For any questions, reach out to{" "}
          <Link href="mailto:newsletter@eaziwage.com" style={link}>
            newsletter@eaziwage.com
          </Link>
          .
        </Text>

        <Text style={text}>
          Best regards,
          <br />
          The EaziWage Team
        </Text>
      </Section>
    </EmailLayout>
  );
}

/* ----------------------------- styles ----------------------------- */

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 24px",
  lineHeight: "1.3",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const highlightBox = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #d1fae5",
  borderRadius: "12px",
  padding: "20px",
  margin: "24px 0",
};

const highlightText = {
  color: "#065f46",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "8px 0",
};

const button = {
  backgroundColor: "#16a34a",
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px 24px",
  margin: "32px 0",
};

const link = {
  color: "#16a34a",
  textDecoration: "underline",
};

const footerLink = {
  color: "#16a34a",
  textDecoration: "none",
  fontWeight: "600",
};