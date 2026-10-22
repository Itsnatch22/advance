create table public.system_audit_logs (
  id uuid not null default gen_random_uuid (),
  admin_id uuid not null,
  admin_name text null,
  target_id text null,
  target_type text null,
  action text not null,
  old_value jsonb null,
  new_value jsonb null,
  reason text null,
  metadata jsonb null,
  created_at timestamp with time zone not null default now(),
  constraint system_audit_logs_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_system_audit_logs_created_at on public.system_audit_logs using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_system_audit_logs_target on public.system_audit_logs using btree (target_type, target_id) TABLESPACE pg_default;