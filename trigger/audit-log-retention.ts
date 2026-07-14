import { schedules, logger } from "@trigger.dev/sdk/v3";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const auditLogRetentionCleanup = schedules.task({
  id: "audit-log-retention-cleanup",
  cron: "0 3 * * *",
  run: async () => {
    logger.info("Running admin_audit_logs retention cleanup");

    const { data, error } = await supabase.rpc("cleanup_admin_audit_logs");

    if (error) {
      logger.error("Retention cleanup failed", { error });
      throw error;
    }

    logger.info("Retention cleanup finished", { deleted: data });
    return { deleted: data };
  },
});
