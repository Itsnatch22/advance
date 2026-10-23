import { Heading, Link, Section, Text } from "@react-email/components";
import { EMAIL_CONFIG } from "@/constants/config";
import EmailLayout from "./EmailLayout";

interface CareerApplicationConfirmationProps {
  applicantName: string;
  roleTitle: string;
  applicationId: string;
}

export default function CareerApplicationConfirmation({
  applicantName,
  roleTitle,
  applicationId,
}: CareerApplicationConfirmationProps) {
  return (
    <EmailLayout
      previewText={`We received your application for ${roleTitle}.`}
      footerLinks={[
        { label: "Website", href: "" },
        { label: "Careers", href: "/careers" },
      ]}
    >
      <Section>
        <Heading style={heading}>Application received</Heading>

        <Text style={text}>Hi {applicantName},</Text>

        <Text style={text}>
          Thank you for your interest in joining EaziWage. We have successfully
          received your application, and our recruitment team will review it.
        </Text>

        <Section style={detailsBox}>
          <Text style={detailLabel}>Position</Text>
          <Text style={position}>{roleTitle}</Text>
          <Text style={detailLabel}>Application reference</Text>
          <Text style={reference}>{applicationId}</Text>
        </Section>

        <Text style={text}>
          We will contact shortlisted candidates about the next steps. If you
          have a question about your application, contact us at{" "}
          <Link href={`mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}`} style={link}>
            {EMAIL_CONFIG.SUPPORT_EMAIL}
          </Link>
          .
        </Text>

        <Text style={text}>
          Thank you again for considering EaziWage.
          <br />
          <strong>The EaziWage Recruitment Team</strong>
        </Text>
      </Section>
    </EmailLayout>
  );
}

const heading = {
  color: "#0f172a",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 24px",
  lineHeight: "1.3",
  fontFamily: 'Georgia, "Times New Roman", serif',
};

const text = {
  color: "#475569",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "16px 0",
};

const detailsBox = {
  backgroundColor: "#f0fdf4",
  border: "1px solid #bbf7d0",
  borderRadius: "16px",
  padding: "20px",
  margin: "24px 0",
};

const detailLabel = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "700",
  letterSpacing: "0.08em",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
};

const position = {
  color: "#166534",
  fontSize: "16px",
  fontWeight: "700",
  lineHeight: "1.5",
  margin: "0 0 18px",
};

const reference = {
  color: "#166534",
  fontFamily: '"SFMono-Regular", Consolas, monospace',
  fontSize: "13px",
  lineHeight: "1.5",
  margin: "0",
  wordBreak: "break-all" as const,
};

const link = {
  color: "#059669",
  fontWeight: "600",
  textDecoration: "underline",
};
