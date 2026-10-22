import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { createRouteHandlerClient } from "@/lib/supabase/route-handler";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export type AdminAuthResult =
  | {
      user: { id: string; email?: string | null };
      admin: SupabaseClient;
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

  // system_admins.id is the primary key and a direct FK to auth.users(id)
  // (i.e. it IS the user's auth id) -- there is no separate user_id column.
  const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: adminRecord, error: adminError } = await admin
    .from("system_admins")
    .select("id, is_admin")
    .eq("id", user.id)
    .single();

  if (adminError || !adminRecord || !adminRecord.is_admin) {
    return { error: "Forbidden - admins only", status: 403 };
  }

  return { user: { id: user.id, email: user.email }, admin };
}

/**
 * Alias for getAuthenticatedAdmin, used at the top of routes that create,
 * edit, send, or delete something. system_admins doesn't currently have a
 * read-only tier -- if one gets added later (e.g. a real role/viewer
 * column), restrict it here without touching every call site.
 */
export async function requireAdminWrite(
  request: NextRequest
): Promise<AdminAuthResult> {
  return getAuthenticatedAdmin(request);
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

  if (error) {
    console.error("[campaign-audit] insert failed:", error);
    throw new Error("Campaign audit write failed", { cause: error });
  }
}
