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
  Hr,
  Link,
} from "@react-email/components";

interface ScheduleNotificationProps {
  attendeeName: string;
  attendeeEmail: string;
  meetingTitle: string;
  meetingDuration: number;
  scheduledDate: string;
  scheduledTime: string;
  timezone: string;
  calendlyEventUrl?: string;
  bookingMode: "user-books" | "admin-books";
  additionalNotes?: string;
}

export default function ScheduleNotification({
  attendeeName,
  attendeeEmail,
  meetingTitle,
  meetingDuration,
  scheduledDate,
  scheduledTime,
  timezone,
  calendlyEventUrl,
  bookingMode,
  additionalNotes,
}: ScheduleNotificationProps) {
  const isUserBooking = bookingMode === "user-books";

  return (
    <Html>
      <Head />
      <Preview>
        New meeting scheduled: {meetingTitle} with {attendeeName}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>Meeting Scheduled</Heading>
            <Text style={headerSubtitle}>EaziWage Calendar System</Text>
          </Section>

          {/* Alert Banner */}
          <Section style={alertBanner}>
            <Text style={alertText}>
              {isUserBooking
                ? "📅 A user has scheduled a meeting with you"
                : "✓ You have scheduled a meeting with a user"}
            </Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            {/* Meeting Details */}
            <Section style={detailsBox}>
              <Heading style={h2}>{meetingTitle}</Heading>
              
              <Section style={detailRow}>
                <Text style={detailLabel}>📅 Date</Text>
                <Text style={detailValue}>{scheduledDate}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>🕐 Time</Text>
                <Text style={detailValue}>
                  {scheduledTime} ({timezone})
                </Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>⏱️ Duration</Text>
                <Text style={detailValue}>{meetingDuration} minutes</Text>
              </Section>

              <Hr style={divider} />

              <Section style={detailRow}>
                <Text style={detailLabel}>👤 Attendee</Text>
                <Text style={detailValue}>{attendeeName}</Text>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>📧 Email</Text>
                <Link href={`mailto:${attendeeEmail}`} style={linkValue}>
                  {attendeeEmail}
                </Link>
              </Section>

              <Section style={detailRow}>
                <Text style={detailLabel}>🔖 Booking Type</Text>
                <Text style={detailValue}>
                  {isUserBooking
                    ? "User → EaziWage"
                    : "EaziWage → User"}
                </Text>
              </Section>

              {additionalNotes && (
                <>
                  <Hr style={divider} />
                  <Section style={notesSection}>
                    <Text style={detailLabel}>📝 Notes</Text>
                    <Text style={notesText}>{additionalNotes}</Text>
                  </Section>
                </>
              )}
            </Section>

            {/* Action Buttons */}
            <Section style={actionSection}>
              <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "0 8px 0 0" }}>
                      {calendlyEventUrl ? (
                        <Button style={primaryButton} href={calendlyEventUrl}>
                          View in Calendly
                        </Button>
                      ) : (
                        <Button
                          style={primaryButton}
                          href="https://calendly.com/event_types"
                        >
                          Open Calendly
                        </Button>
                      )}
                    </td>
                    <td style={{ padding: "0 0 0 8px" }}>
                      <Button
                        style={secondaryButton}
                        href={`mailto:${attendeeEmail}?subject=Re: ${meetingTitle}`}
                      >
                        Email Attendee
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>

            {/* Preparation Tips */}
            <Section style={tipsBox}>
              <Text style={tipsHeading}>📋 Meeting Preparation</Text>
              <ul style={tipsList}>
                <li style={tipsItem}>
                  Add this meeting to your calendar
                </li>
                <li style={tipsItem}>
                  Review the attendee's information beforehand
                </li>
                <li style={tipsItem}>
                  Prepare any materials or documents needed
                </li>
                <li style={tipsItem}>
                  Test your video conferencing setup 5 minutes early
                </li>
              </ul>
            </Section>

            {/* Quick Actions */}
            <Section style={quickActionsSection}>
              <Text style={quickActionsHeading}>Quick Actions</Text>
              <table style={{ width: "100%", borderCollapse: "collapse" as const }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "4px" }}>
                      <Link href={`mailto:${attendeeEmail}`} style={quickLink}>
                        → Send welcome email
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px" }}>
                      <Link
                        href={`https://eaziwage.com/admin/meetings`}
                        style={quickLink}
                      >
                        → View all meetings
                      </Link>
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "4px" }}>
                      <Link href="https://calendly.com/app" style={quickLink}>
                        → Manage availability
                      </Link>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Hr style={footerDivider} />
            <Text style={footerText}>
              This notification was sent from the EaziWage scheduling system
            </Text>
            <Text style={footerText}>
              <Link href="https://eaziwage.com" style={footerLink}>
                EaziWage
              </Link>
              {" • "}
              <Link href="mailto:support@eaziwage.com" style={footerLink}>
                support@eaziwage.com
              </Link>
              {" • "}
              <Link href="tel:+254723154900" style={footerLink}>
                +254 723 154900
              </Link>
            </Text>
            <Text style={footerTextSmall}>Nairobi, Kenya</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ----------------------------- styles ----------------------------- */

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden" as const,
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
};

const header = {
  backgroundColor: "#16a34a",
  padding: "32px 40px",
  textAlign: "center" as const,
};

const h1 = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0",
  lineHeight: "1.3",
};

const h2 = {
  color: "#111827",
  fontSize: "22px",
  fontWeight: "700",
  margin: "0 0 20px",
  lineHeight: "1.3",
};

const headerSubtitle = {
  color: "#d1fae5",
  fontSize: "14px",
  margin: "8px 0 0",
  fontWeight: "500",
};

const alertBanner = {
  backgroundColor: "#dbeafe",
  borderLeft: "4px solid #3b82f6",
  padding: "16px 40px",
};

const alertText = {
  color: "#1e40af",
  fontSize: "14px",
  margin: "0",
  lineHeight: "1.5",
  fontWeight: "600",
};

const content = {
  padding: "40px",
};

const detailsBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "24px",
  marginBottom: "24px",
};

const detailRow = {
  marginBottom: "16px",
};

const detailLabel = {
  color: "#6b7280",
  fontSize: "13px",
  fontWeight: "600",
  margin: "0 0 4px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const detailValue = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: "500",
  margin: "0",
  lineHeight: "1.5",
};

const linkValue = {
  color: "#16a34a",
  fontSize: "16px",
  textDecoration: "underline",
  margin: "0",
  display: "block",
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
};

const notesSection = {
  marginTop: "16px",
};

const notesText = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "8px 0 0",
  whiteSpace: "pre-wrap" as const,
  backgroundColor: "#ffffff",
  padding: "12px",
  borderRadius: "6px",
  border: "1px solid #e5e7eb",
};

const actionSection = {
  marginTop: "32px",
  paddingTop: "24px",
  borderTop: "2px solid #e5e7eb",
};

const primaryButton = {
  backgroundColor: "#16a34a",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 20px",
  width: "100%",
};

const secondaryButton = {
  backgroundColor: "#f3f4f6",
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  color: "#374151",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 20px",
  width: "100%",
};

const tipsBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #fbbf24",
  borderRadius: "8px",
  padding: "20px",
  marginTop: "24px",
};

const tipsHeading = {
  color: "#92400e",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 12px",
};

const tipsList = {
  margin: "0",
  paddingLeft: "20px",
  color: "#78350f",
};

const tipsItem = {
  fontSize: "13px",
  lineHeight: "1.6",
  marginBottom: "6px",
};

const quickActionsSection = {
  marginTop: "24px",
  padding: "20px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
};

const quickActionsHeading = {
  color: "#111827",
  fontSize: "14px",
  fontWeight: "700",
  margin: "0 0 12px",
};

const quickLink = {
  color: "#16a34a",
  fontSize: "13px",
  textDecoration: "none",
  display: "block",
  lineHeight: "1.8",
};

const footer = {
  padding: "24px 40px",
};

const footerDivider = {
  borderColor: "#e5e7eb",
  margin: "0 0 20px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "1.6",
  textAlign: "center" as const,
  margin: "8px 0",
};

const footerTextSmall = {
  color: "#9ca3af",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "4px 0 0",
};

const footerLink = {
  color: "#16a34a",
  textDecoration: "none",
};