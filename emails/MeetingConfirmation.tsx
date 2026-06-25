import { Section, Heading, Text, Button, Link } from "@react-email/components";
import  EmailLayout  from "./EmailLayout";

interface MeetingConfirmationProps {
  userEmail: string;
  adminEmail: string;
  meetingType: string;
  scheduledAt: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://eaziwage.com";

export default function MeetingConfirmation({
  userEmail,
  adminEmail,
  meetingType,
  scheduledAt,
}: MeetingConfirmationProps) {
  return (
    <EmailLayout
      previewText="Meeting Confirmation - EaziWage"
    >
      {/* Content */}
      <Section>
        <Heading style={h1}>Meeting Scheduled Successfully!</Heading>

        <Text style={text}>Hi,</Text>

        <Text style={text}>
          Your meeting has been successfully scheduled. Details are below:
        </Text>

        <Section style={highlightBox}>
          <Text style={highlightText}>
            <strong>Meeting Type:</strong> {meetingType.replace(/_/g, " ").toUpperCase()}
          </Text>
          <Text style={highlightText}>
            <strong>Scheduled For:</strong> {scheduledAt}
          </Text>
          <Text style={highlightText}>
            <strong>Participants:</strong> {userEmail} & {adminEmail}
          </Text>
        </Section>

        <Text style={text}>
          A calendar invitation has been sent to your email address with the meeting link. 
          If you need to reschedule or cancel, please use the links provided in that invitation.
        </Text>

        <Button style={button} href={baseUrl}>
          Go to EaziWage
        </Button>

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