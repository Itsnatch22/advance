import { randomUUID } from "crypto";
import { NextRequest } from "next/server";
import { Resend } from "resend";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  careerApplicationLimiter,
  checkRateLimit,
} from "@/lib/security/rate-limit";
import { getSupabaseAdmin } from "@/lib/server/supabaseAdmin";
import { sendError, sendSuccess } from "@/lib/utils/response";
import {
  careerApplicationForbiddenClientFields,
  careerApplicationSchema,
  getCareerApplicationFileExtension,
  validateCareerApplicationFile,
} from "@/lib/validations/career-application";
import { EMAIL_CONFIG, COMPANY_CONFIG } from "@/constants/config";

export const dynamic = "force-dynamic";

type RouteProps = {
  params: Promise<{ slug: string }>;
};

type CareerForApplication = {
  id: string;
  slug: string;
  title: string;
  status: "open" | "closed" | "archived";
  is_open: boolean;
  apply_email: string | null;
};

type CareerDatabase = {
  public: {
    Tables: {
      careers: {
        Row: CareerForApplication;
        Insert: never;
        Update: never;
        Relationships: [];
      };
      career_applications: {
        Row: { id: string };
        Insert: {
          career_id: string;
          career_title_snapshot: string;
          career_slug_snapshot: string;
          full_name: string;
          email: string;
          phone: string | null;
          resume_url: string;
          cover_letter: string | null;
          linkedin_url: string | null;
          portfolio_url: string | null;
          status: "submitted";
          consent: boolean;
          consent_given_at: string;
        };
        Update: never;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function POST(request: NextRequest, { params }: RouteProps) {
  const { slug } = await params;
  const ip = getClientIp(request);

  try {
    const formData = await request.formData();

    const forbiddenField = careerApplicationForbiddenClientFields.find(
      (field) => formData.has(field)
    );
    if (forbiddenField) {
      return sendError(
        `Do not submit server-owned field: ${forbiddenField}`,
        400
      );
    }

    const parsed = careerApplicationSchema.safeParse({
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      phone: formData.get("phone") ?? "",
      cover_letter: formData.get("cover_letter") ?? "",
      linkedin_url: formData.get("linkedin_url") ?? "",
      portfolio_url: formData.get("portfolio_url") ?? "",
      consent: formData.get("consent") === "true",
    });

    if (!parsed.success) {
      return sendError("Validation failed", 400, {
        issues: parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const rateLimitResult = await checkRateLimit(
      careerApplicationLimiter,
      `career-application:${ip}:${parsed.data.email.toLowerCase()}`
    );
    if (!rateLimitResult.success) {
      return sendError(
        "Too many application attempts. Please try again later.",
        429,
        undefined,
        rateLimitResult.headers
      );
    }

    const resumeFile = formData.get("resume_file");
    if (!(resumeFile instanceof File)) {
      return sendError("Resume is required", 400);
    }

    const fileError = validateCareerApplicationFile(resumeFile);
    if (fileError) {
      return sendError(fileError, 400);
    }

    const supabase = getSupabaseAdmin() as SupabaseClient<CareerDatabase>;
    const { data: career, error: careerError } = await supabase
      .from("careers")
      .select("id,slug,title,status,is_open,apply_email")
      .eq("slug", slug)
      .maybeSingle();

    if (careerError) {
      console.error(
        "[careers/applications] career lookup failed:",
        careerError
      );
      return sendError("Unable to verify this role. Please try again.", 500);
    }

    const resolvedCareer = career as CareerForApplication | null;
    if (!resolvedCareer) {
      return sendError("This role could not be found.", 404);
    }

    if (resolvedCareer.status !== "open" || !resolvedCareer.is_open) {
      return sendError("This role is no longer accepting applications.", 409);
    }

    const extension = getCareerApplicationFileExtension(resumeFile.name);
    const storagePath = [
      "career-applications",
      resolvedCareer.slug,
      `${new Date().toISOString().slice(0, 10)}-${randomUUID()}${extension}`,
    ].join("/");

    const { error: uploadError } = await supabase.storage
      .from("career-applications")
      .upload(storagePath, resumeFile, {
        cacheControl: "3600",
        contentType: resumeFile.type,
        upsert: false,
      });

    if (uploadError) {
      console.error(
        "[careers/applications] resume upload failed:",
        uploadError
      );
      return sendError("Resume upload failed. Please try again.", 500);
    }

    const submittedAt = new Date();
    const { data: application, error: insertError } = await supabase
      .from("career_applications")
      .insert({
        career_id: resolvedCareer.id,
        career_title_snapshot: resolvedCareer.title,
        career_slug_snapshot: resolvedCareer.slug,
        full_name: parsed.data.full_name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        resume_url: storagePath,
        cover_letter: parsed.data.cover_letter || null,
        linkedin_url: parsed.data.linkedin_url || null,
        portfolio_url: parsed.data.portfolio_url || null,
        status: "submitted",
        consent: true,
        consent_given_at: submittedAt.toISOString(),
      })
      .select("id")
      .single();

    if (insertError) {
      await supabase.storage.from("career-applications").remove([storagePath]);
      console.error("[careers/applications] insert failed:", insertError);
      return sendError("Application submission failed. Please try again.", 500);
    }

    await sendApplicationEmails({
      applicantEmail: parsed.data.email,
      applicantName: parsed.data.full_name,
      applicationId: application.id,
      applyEmail: resolvedCareer.apply_email,
      roleTitle: resolvedCareer.title,
      submittedAt,
    });

    return sendSuccess(
      {
        applicationId: application.id,
        message: `Thank you for applying for the ${resolvedCareer.title} role. We'll review your application and get back to you soon.`,
      },
      201,
      undefined,
      {
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
      }
    );
  } catch (error) {
    console.error("[careers/applications] unexpected error:", error);
    return sendError("An unexpected error occurred. Please try again.", 500);
  }
}

function getClientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

async function sendApplicationEmails(input: {
  applicantEmail: string;
  applicantName: string;
  applicationId: string;
  applyEmail: string | null;
  roleTitle: string;
  submittedAt: Date;
}) {
  if (!resend) {
    console.error("[careers/applications] RESEND_API_KEY is not configured");
    return;
  }

  const submittedAt = input.submittedAt.toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
  });

  try {
    await resend.emails.send({
      from: `EaziWage Careers <${EMAIL_CONFIG.SENDER_ADDRESS}>`,
      to: input.applicantEmail,
      subject: `Application received for ${input.roleTitle}`,
      text: `Hi ${input.applicantName},\n\nWe received your application for ${input.roleTitle} on ${submittedAt}. Our hiring team will review it and follow up with next steps.\n\nEaziWage Careers`,
    });
  } catch (error) {
    console.error("[careers/applications] candidate email failed:", {
      applicationId: input.applicationId,
      applicantEmail: input.applicantEmail,
      error,
    });
  }

  if (!input.applyEmail) {
    console.error(
      "[careers/applications] apply_email is missing for role notification",
      {
        applicationId: input.applicationId,
        roleTitle: input.roleTitle,
      }
    );
    return;
  }

  try {
    await resend.emails.send({
      from: `EaziWage Careers <${EMAIL_CONFIG.SENDER_ADDRESS}>`,
      to: input.applyEmail,
      replyTo: input.applicantEmail,
      subject: `New application: ${input.roleTitle}`,
      text: `A new application was submitted for ${input.roleTitle}.\n\nCandidate: ${input.applicantName}\nEmail: ${input.applicantEmail}\nSubmitted: ${submittedAt}\nApplication ID: ${input.applicationId}\n\nReview it in ${COMPANY_CONFIG.HOMEPAGE_URL}/admin/careers/applications`,
    });
  } catch (error) {
    console.error("[careers/applications] internal notification failed:", {
      applicationId: input.applicationId,
      applyEmail: input.applyEmail,
      error,
    });
  }
}
