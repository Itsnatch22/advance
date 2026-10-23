import { Heading, Link, Section, Text } from "@react-email/components";
import { EMAIL_CONFIG } from "@/constants/config";
import EmailLayout from "./EmailLayout";

export type NotifiableCareerApplicationStatus =
  "shortlisted" | "rejected" | "hired";

interface CareerApplicationStatusUpdateProps {
  applicantName: string;
  roleTitle: string;
  applicationId: string;
  status: NotifiableCareerApplicationStatus;
}

const statusCopy: Record<
  NotifiableCareerApplicationStatus,
  { subject: string; heading: string; message: string }
> = {
  shortlisted: {
    subject: "Your application has been shortlisted",
    heading: "You've been shortlisted",
    message:
      "We’re pleased to let you know that your application has been shortlisted. Our recruitment team will be in touch about the next steps.",
  },
  rejected: {
    subject: "An update on your EaziWage application",
    heading: "Thank you for your application",
    message:
      "After careful consideration, we won’t be moving forward with your application for this role. We appreciate the time you took to apply and encourage you to explore future opportunities with EaziWage.",
  },
  hired: {
    subject: "Congratulations on your EaziWage application",
    heading: "Congratulations",
    message:
      "We’re pleased to let you know that you’ve been selected for this role. Our recruitment team will contact you about the next steps.",
  },
};

export function getCareerApplicationStatusSubject(
  status: NotifiableCareerApplicationStatus,
  roleTitle: string
) {
  return `${statusCopy[status].subject}: ${roleTitle} at EaziWage`;
}

export default function CareerApplicationStatusUpdate({
  applicantName,
  roleTitle,
  applicationId,
  status,
}: CareerApplicationStatusUpdateProps) {
  const copy = statusCopy[status];

  return (
    <EmailLayout
      previewText={`${copy.heading}: ${roleTitle}`}
      footerLinks={[
        { label: "Website", href: "" },
        { label: "Careers", href: "/careers" },
      ]}
    >
      <Section>
        <Heading style={heading}>{copy.heading}</Heading>
        <Text style={text}>Hi {applicantName},</Text>
        <Text style={text}>{copy.message}</Text>

        <Section style={detailsBox}>
          <Text style={detailLabel}>Position</Text>
          <Text style={position}>{roleTitle}</Text>
          <Text style={detailLabel}>Application reference</Text>
          <Text style={reference}>{applicationId}</Text>
        </Section>

        <Text style={text}>
          If you have a question, contact our recruitment team at{" "}
          <Link href={`mailto:${EMAIL_CONFIG.SUPPORT_EMAIL}`} style={link}>
            {EMAIL_CONFIG.SUPPORT_EMAIL}
          </Link>
          .
        </Text>
        <Text style={text}>
          Thank you for your interest in EaziWage.
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
