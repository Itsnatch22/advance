-- Add role granularity to system_admins. Previously admin membership was
-- binary (in the table or not), with no way to give someone read-only
-- access to the admin panel without also giving them the ability to send
-- campaigns, edit templates, or otherwise mutate data.

ALTER TABLE public.system_admins
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'admin';

ALTER TABLE public.system_admins
  DROP CONSTRAINT IF EXISTS system_admins_role_check;

ALTER TABLE public.system_admins
  ADD CONSTRAINT system_admins_role_check CHECK (role IN ('admin', 'viewer'));

COMMENT ON COLUMN public.system_admins.role IS
  'admin: full read/write access. viewer: read-only, cannot create/edit/send/delete.';
