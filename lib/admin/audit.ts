import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Write an administrator action to the shared system audit trail.
 * system_audit_logs.admin_id is required, so unattributed system events must
 * use a separate event log rather than impersonating an administrator.
 */
export async function logAdminAction(
  adminId: string | null,
  action: string,
  opts?: {
    objectType?: string;
    objectId?: string;
    meta?: Record<string, unknown>;
  }
) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "[system-audit] Supabase is not configured; audit write skipped"
    );
    return;
  }

  if (!adminId || !UUID_PATTERN.test(adminId)) {
    console.warn(`[system-audit] Skipping unattributed event: ${action}`);
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  try {
    const { error } = await supabase.from("system_audit_logs").insert({
      admin_id: adminId,
      admin_name: null,
      target_id: opts?.objectId ?? null,
      target_type: opts?.objectType ?? null,
      action,
      old_value: null,
      new_value: null,
      reason: null,
      metadata: opts?.meta ?? {},
    });

    if (error) console.error("[system-audit] Failed to insert log", error);
  } catch (error) {
    console.error("[system-audit] Unexpected insert error", error);
  }
}
