import { NextRequest } from "next/server";
import { createElement } from "react";
import { Resend } from "resend";
import CareerApplicationStatusUpdate, {
  type NotifiableCareerApplicationStatus,
  getCareerApplicationStatusSubject,
} from "@/emails/CareerApplicationStatusUpdate";
import { EMAIL_CONFIG } from "@/constants/config";
import { z } from "zod";
import { logAdminAction } from "@/lib/admin/audit";
import { requireAdminWrite } from "@/lib/admin/campaigns";
import { sendError, sendSuccess } from "@/lib/utils/response";

export const dynamic = "force-dynamic";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const statusSchema = z.object({
  status: z.enum(["under_review", "shortlisted", "rejected", "hired"]),
});

const allowedTransitions: Record<string, string[]> = {
  submitted: ["under_review"],
  under_review: ["shortlisted", "rejected"],
  shortlisted: ["rejected", "hired"],
  rejected: [],
  hired: [],
};

type RouteProps = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, { params }: RouteProps) {
  const auth = await requireAdminWrite(request);
  if ("error" in auth) {
    return sendError(auth.error, auth.status);
  }

  const { id } = await params;
  const { admin, user } = auth;
  const parsed = statusSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return sendError("Validation failed", 400, {
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
  }

  const { data: existing, error: fetchError } = await admin
    .from("career_applications")
    .select("id,status")
    .eq("id", id)
    .single();

  if (fetchError || !existing) {
    return sendError("Application not found", 404);
  }

  const oldStatus = existing.status as string;
  const newStatus = parsed.data.status;

  if (!allowedTransitions[oldStatus]?.includes(newStatus)) {
    return sendError(
      `Cannot move application from ${oldStatus} to ${newStatus}`,
      409
    );
  }

  const changedAt = new Date().toISOString();
  const { data: updated, error: updateError } = await admin
    .from("career_applications")
    .update({ status: newStatus, updated_at: changedAt })
    .eq("id", id)
    .select(
      "id,career_title_snapshot,career_slug_snapshot,full_name,email,status,created_at,updated_at"
    )
    .single();

  if (updateError) {
    console.error(
      "[admin/careers/applications/status] update failed:",
      updateError
    );
    return sendError("Unable to update application status", 500);
  }

  const auditPayload = {
    application_id: id,
    actor_id: user.id,
    old_status: oldStatus,
    new_status: newStatus,
    changed_at: changedAt,
  };

  const { error: statusAuditError } = await admin
    .from("career_application_status_audit")
    .insert(auditPayload);

  if (statusAuditError) {
    console.error(
      "[admin/careers/applications/status] status audit failed:",
      statusAuditError
    );
  }

  await logAdminAction(user.id, "career_application_status_changed", {
    objectType: "career_application",
    objectId: id,
    meta: auditPayload,
  });

  let statusEmailSent: boolean | null = null;
  if (
    newStatus === "shortlisted" ||
    newStatus === "rejected" ||
    newStatus === "hired"
  ) {
    statusEmailSent = await sendStatusEmail({
      applicantName: updated.full_name,
      applicantEmail: updated.email,
      applicationId: updated.id,
      roleTitle: updated.career_title_snapshot,
      status: newStatus,
    });
  }

  return sendSuccess({ application: updated, statusEmailSent });
}

async function sendStatusEmail(input: {
  applicantName: string;
  applicantEmail: string;
  applicationId: string;
  roleTitle: string;
  status: NotifiableCareerApplicationStatus;
}) {
  if (!resend) {
    console.error(
      "[admin/careers/applications/status] RESEND_API_KEY is not configured"
    );
    return false;
  }

  try {
    const { error } = await resend.emails.send({
      from: EMAIL_CONFIG.SENDER_ADDRESS,
      to: input.applicantEmail,
      subject: getCareerApplicationStatusSubject(input.status, input.roleTitle),
      react: createElement(CareerApplicationStatusUpdate, {
        applicantName: input.applicantName,
        roleTitle: input.roleTitle,
        applicationId: input.applicationId,
        status: input.status,
      }),
    });

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(
      "[admin/careers/applications/status] applicant email failed:",
      {
        applicationId: input.applicationId,
        status: input.status,
        error,
      }
    );
    return false;
  }
}
