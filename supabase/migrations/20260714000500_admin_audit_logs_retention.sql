-- Add indexes and retention function for admin_audit_logs

-- Index on object_type and object_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_object_type ON admin_audit_logs (object_type);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_object_id ON admin_audit_logs (object_id);

-- Retention settings table (allow operators to configure retention without schema edits)
CREATE TABLE IF NOT EXISTS admin_audit_logs_retention_settings (
  id serial primary key,
  retention_days int NOT NULL DEFAULT 90,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Ensure a default settings row exists
INSERT INTO admin_audit_logs_retention_settings (retention_days)
SELECT 90
WHERE NOT EXISTS (SELECT 1 FROM admin_audit_logs_retention_settings);

-- Cleanup function: deletes entries older than retention_days (defaults to 90)
CREATE OR REPLACE FUNCTION cleanup_admin_audit_logs() RETURNS int LANGUAGE plpgsql AS $$
DECLARE
  days int := 90;
  deleted int := 0;
BEGIN
  SELECT retention_days INTO days FROM admin_audit_logs_retention_settings ORDER BY id LIMIT 1;
  IF days IS NULL THEN
    days := 90;
  END IF;

  DELETE FROM admin_audit_logs WHERE created_at < now() - (days || ' days')::interval RETURNING 1 INTO deleted;
  GET DIAGNOSTICS deleted = ROW_COUNT;
  RETURN deleted;
END;
$$;

-- NOTE: To schedule automatic retention, create a cron job that runs:
--   SELECT cleanup_admin_audit_logs();
-- For example, with the 'pg_cron' extension: SELECT cron.schedule('0 3 * * *', $$SELECT cleanup_admin_audit_logs();$$);
-- If pg_cron is not available, schedule via your orchestration (e.g., GitHub Actions, Trigger.dev) to call the function via supabase/sql admin API.
