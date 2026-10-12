import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { EMAIL_CONFIG } from '@/constants/config';
import MeetingConfirmation from "@/emails/MeetingConfirmation";
import { logAdminAction } from "@/lib/admin/audit";

const ADMIN_EMAIL = EMAIL_CONFIG.SUPPORT_EMAIL;
const SUPPORT_CC_EMAILS = EMAIL_CONFIG.SUPPORT_CC_EMAILS;


const KNOWN_MEETING_TYPES = [
  "user_to_admin",
  "sales_demo",
  "partner_onboarding",
] as const;
type MeetingType = (typeof KNOWN_MEETING_TYPES)[number];

function isKnownMeetingType(v: unknown): v is MeetingType {
  return typeof v === "string" && (KNOWN_MEETING_TYPES as readonly string[]).includes(v);
}

const supabaseAdmin =
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : null;

// Calendly's v2 webhook signature: header is "t=<unix_ts>,v1=<hex_hmac>".
// The signed content is `${t}.${rawBody}`, HMAC-SHA256'd with the signing
// key from the webhook subscription (Calendly dashboard -> webhook ->
// signing key). This MUST run against the raw request body text, not a
// re-serialized JSON.parse(...) of it, or the signature will never match.
function verifyCalendlySignature(
  rawBody: string,
  signatureHeader: string | null,
  signingKey: string
): boolean {
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => {
      const [k, v] = p.split("=");
      return [k, v];
    })
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const timestampMs = Number(timestamp) * 1000;
  if (!Number.isFinite(timestampMs) || Math.abs(Date.now() - timestampMs) > 5 * 60 * 1000) {
    return false;
  }

  const expected = crypto
    .createHmac("sha256", signingKey)
    .update(`${timestamp}.${rawBody}`)
    .digest("hex");

  const expectedBuf = Buffer.from(expected, "hex");
  const actualBuf = Buffer.from(signature, "hex");
  if (expectedBuf.length !== actualBuf.length) return false;

  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

// Shape of the fields we actually use from a Calendly v2 "invitee.created"
// payload. Calendly sends considerably more (questions_and_answers,
// reschedule/cancel URLs, payment info, etc.) - only listing what's read.
interface CalendlyInviteeCreatedPayload {
  event: "invitee.created";
  payload: {
    email?: string;
    name?: string;
    uri?: string; // invitee URI - .../invitees/{invitee_uuid}
    scheduled_event?: {
      // Calendly v2 exposes uri, not uuid. UUID is the last path segment.
      // e.g. "https://api.calendly.com/scheduled_events/{UUID}"
      uri?: string;
      start_time?: string;
    };
    tracking?: {
      utm_content?: string | null;
    };
  };
}

export async function POST(request: NextRequest) {
  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  const signingKey = process.env.CALENDLY_WEBHOOK_SIGNING_KEY;
  if (!signingKey) {
    console.error("CALENDLY_WEBHOOK_SIGNING_KEY is not set");
    return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
  }

  // Signature verification needs the exact raw bytes Calendly signed, so
  // read text() first and only JSON.parse afterward - never the reverse.
  const rawBody = await request.text();
  const signatureHeader = request.headers.get("calendly-webhook-signature");

  if (!verifyCalendlySignature(rawBody, signatureHeader, signingKey)) {
    console.warn("Calendly webhook signature verification failed");
    await logAdminAction(null, "webhook.calendly.invalid_signature", {
      objectType: "webhook",
      meta: { hasSignatureHeader: !!signatureHeader },
    });
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let body: CalendlyInviteeCreatedPayload;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Calendly also delivers invitee.canceled and routing_form_submission.created
  // to this same endpoint if the webhook subscription is set to "all events".
  // Acknowledge with 200 so Calendly doesn't retry - we just don't act on them.
  if (body.event !== "invitee.created") {
    return NextResponse.json({ received: true, ignored: body.event });
  }

  const email = body.payload.email;
  const scheduledAt = body.payload.scheduled_event?.start_time;
  // Calendly v2 puts the event UUID as the last segment of the scheduled_event.uri
  const eventUri = body.payload.scheduled_event?.uri;
  const calendlyEventId = eventUri ? (eventUri.split("/").pop() ?? null) : null;
  const utmContent = body.payload.tracking?.utm_content;

  if (!email || !scheduledAt || !calendlyEventId) {
    console.error("Calendly webhook payload missing required fields", {
      hasEmail: !!email,
      hasScheduledAt: !!scheduledAt,
      hasEventId: !!calendlyEventId,
    });
    // Acknowledge anyway - retrying won't produce different data, and
    // returning non-2xx just causes Calendly to keep redelivering it.
    return NextResponse.json({ received: true, error: "missing fields" });
  }

  const meetingType: MeetingType = isKnownMeetingType(utmContent)
    ? utmContent
    : "user_to_admin"; // fallback for bookings made outside the /schedule page's tracked links
  if (!isKnownMeetingType(utmContent)) {
    console.warn("Calendly webhook: unrecognized/missing utm_content", { utmContent, calendlyEventId });
  }

  // Upsert on calendly_event_id so a Calendly webhook redelivery (Calendly
  // retries on non-2xx, and can also occasionally double-send) doesn't
  // create duplicate rows or send duplicate confirmation emails.
  // Requires: alter table meeting_logs add constraint meeting_logs_calendly_event_id_key unique (calendly_event_id);
  const { error: dbError, data: upserted } = await supabaseAdmin
    .from("meeting_logs")
    .upsert(
      {
        user_email: email,
        admin_email: ADMIN_EMAIL,
        meeting_type: meetingType,
        calendly_event_id: calendlyEventId,
        scheduled_at: scheduledAt,
      },
      { onConflict: "calendly_event_id", ignoreDuplicates: true }
    )
    .select();

  if (dbError) {
    console.error("Supabase error logging meeting:", dbError);
    await logAdminAction(null, "webhook.calendly.db_error", {
      objectType: "meeting",
      objectId: calendlyEventId,
      meta: { error: dbError.message },
    });
    return NextResponse.json({ error: "Failed to log meeting" }, { status: 500 });
  }

  // ignoreDuplicates means a redelivery returns no row back - skip re-sending
  // emails for a meeting we've already processed.
  const isNewRecord = (upserted?.length ?? 0) > 0;
  if (!isNewRecord) {
    return NextResponse.json({ received: true, duplicate: true });
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.error("RESEND_API_KEY not set - meeting logged but no confirmation email sent");
    return NextResponse.json({ received: true, warning: "email not sent" });
  }
  const resend = new Resend(resendApiKey);

  const scheduledDate = new Date(scheduledAt).toLocaleString("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  try {
    await Promise.all([
      resend.emails.send({
        from: `EaziWage <${EMAIL_CONFIG.MEETINGS_SENDER}>`,
        to: email,
        cc: SUPPORT_CC_EMAILS,
        subject: "Meeting Confirmed - EaziWage",
        react: MeetingConfirmation({
          userEmail: email,
          adminEmail: ADMIN_EMAIL,
          meetingType,
          scheduledAt: scheduledDate,
        }),
      }),
      resend.emails.send({
        from: `EaziWage <${EMAIL_CONFIG.MEETINGS_SENDER}>`,
        to: ADMIN_EMAIL,
        cc: SUPPORT_CC_EMAILS,
        subject: "New Meeting Scheduled - EaziWage",
        react: MeetingConfirmation({
          userEmail: email,
          adminEmail: ADMIN_EMAIL,
          meetingType,
          scheduledAt: scheduledDate,
        }),
      }),
    ]);
  } catch (emailError) {
    // Meeting is already logged at this point - don't fail the webhook over
    // an email delivery problem, or Calendly will retry and we've already
    // guarded against duplicate rows above (but not duplicate emails on a
    // retry of THIS attempt, since isNewRecord was true and won't be true
    // again). Just log it for manual follow-up.
    console.error("Resend error sending confirmation emails:", emailError);
    await logAdminAction(null, "webhook.calendly.email_failure", {
      objectType: "meeting",
      objectId: calendlyEventId,
      meta: { error: emailError instanceof Error ? emailError.message : String(emailError) },
    });
  }

  return NextResponse.json({ received: true });
}