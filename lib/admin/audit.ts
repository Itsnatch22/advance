import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // Don't throw at import time; functions should guard and log if called without config.
}

export async function logAdminAction(
  adminId: string | null,
  action: string,
  opts?: { objectType?: string; objectId?: string; meta?: Record<string, unknown> }
) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('[admin-audit] Supabase not configured; skipping audit log');
    return;
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  try {
    const { error } = await supabase.from('admin_audit_logs').insert([
      {
        admin_id: adminId,
        action,
        object_type: opts?.objectType ?? null,
        object_id: opts?.objectId ?? null,
        meta: opts?.meta ?? {},
      },
    ]);

    if (error) {
      console.error('[admin-audit] failed to insert log', error);
    }
  } catch (err) {
    console.error('[admin-audit] unexpected error', err);
  }
}
