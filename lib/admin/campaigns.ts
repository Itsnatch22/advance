import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export type AdminRole = "admin" | "viewer";

export type AdminAuthResult =
  | {
      user: { id: string; email?: string | null };
      admin: SupabaseClient;
      role: AdminRole;
    }
  | { error: string; status: 401 | 403 };

export async function getAuthenticatedAdmin(
  _request: NextRequest
): Promise<AdminAuthResult> {
  const supabase = await createRouteHandlerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Unauthorized", status: 401 };

  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: adminRecord, error: adminError } = await admin
    .from("system_admins")
    .select("id, role")
    .eq("user_id", user.id)
    .single();

  if (adminError || !adminRecord) {
    return { error: "Forbidden - admins only", status: 403 };
  }

  const role: AdminRole = adminRecord.role === "viewer" ? "viewer" : "admin";

  return { user: { id: user.id, email: user.email }, admin, role };
}

/**
 * Same as getAuthenticatedAdmin, but additionally rejects the "viewer"
 * role. Use this at the top of any route handler that creates, edits,
 * sends, or deletes something -- viewers get read-only access.
 */
export async function requireAdminWrite(
  request: NextRequest
): Promise<AdminAuthResult> {
  const auth = await getAuthenticatedAdmin(request);
  if ("error" in auth) return auth;

  if (auth.role !== "admin") {
    return { error: "Forbidden - your account has read-only access", status: 403 };
  }

  return auth;
}

export async function logCampaignAudit(
  admin: SupabaseClient,
  input: {
    campaignId: string;
    actorId: string;
    action: string;
    metadata?: Record<string, unknown>;
  }
) {
  const { error } = await admin.from("email_campaign_audit_logs").insert({
    campaign_id: input.campaignId,
    actor_id: input.actorId,
    action: input.action,
    metadata: input.metadata ?? {},
  });

  if (error && error.code !== "42P01") {
    console.error("[campaign-audit] insert failed:", error);
  }
}
