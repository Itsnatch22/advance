import { NextRequest } from "next/server";
import { getAuthenticatedAdmin } from "@/lib/admin/campaigns";
import { sendError, sendSuccess } from "@/lib/utils/response";

export const dynamic = "force-dynamic";

const APPLICATION_STATUSES = [
  "submitted",
  "under_review",
  "shortlisted",
  "rejected",
  "hired",
] as const;

export async function GET(request: NextRequest) {
  const auth = await getAuthenticatedAdmin(request);
  if ("error" in auth) {
    return sendError(auth.error, auth.status);
  }

  const { admin } = auth;
  const url = new URL(request.url);
  const role = url.searchParams.get("role");
  const status = url.searchParams.get("status");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const search = url.searchParams.get("search");

  let query = admin
    .from("career_applications")
    .select(
      "id,career_id,career_title_snapshot,career_slug_snapshot,full_name,email,phone,resume_url,cover_letter,linkedin_url,portfolio_url,status,consent_given_at,created_at"
    )
    .order("created_at", { ascending: false })
    .limit(100);

  if (role) query = query.eq("career_slug_snapshot", role);
  if (status && APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number])) {
    query = query.eq("status", status);
  }
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);
  if (search) {
    const escaped = search.replaceAll("%", "\\%").replaceAll("_", "\\_");
    query = query.or(`full_name.ilike.%${escaped}%,email.ilike.%${escaped}%`);
  }

  const { data: applications, error } = await query;
  if (error) {
    console.error("[admin/careers/applications] list failed:", error);
    return sendError("Unable to load career applications", 500);
  }

  const withSignedUrls = await Promise.all(
    (applications ?? []).map(async (application) => {
      if (!application.resume_url) {
        return { ...application, resume_signed_url: null };
      }

      const { data, error: signedUrlError } = await admin.storage
        .from("career-applications")
        .createSignedUrl(application.resume_url, 60 * 10);

      if (signedUrlError) {
        console.error("[admin/careers/applications] signed URL failed:", {
          applicationId: application.id,
          error: signedUrlError,
        });
      }

      return {
        ...application,
        resume_signed_url: data?.signedUrl ?? null,
      };
    })
  );

  const { data: careers } = await admin
    .from("careers")
    .select("slug,title")
    .order("title", { ascending: true });

  return sendSuccess({
    applications: withSignedUrls,
    careers: careers ?? [],
    statuses: APPLICATION_STATUSES,
  });
}
