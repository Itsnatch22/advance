do $$
begin
  create type public.career_application_status as enum (
    'submitted',
    'under_review',
    'shortlisted',
    'rejected',
    'hired'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.career_applications (
  id uuid primary key default gen_random_uuid(),
  career_id uuid not null references public.careers(id) on delete restrict,
  career_title_snapshot text not null,
  career_slug_snapshot text not null,
  full_name text not null,
  email text not null,
  phone text null,
  resume_url text not null,
  cover_letter text null,
  linkedin_url text null,
  portfolio_url text null,
  status public.career_application_status not null default 'submitted',
  consent boolean not null default false,
  consent_given_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint chk_career_applications_consent_timestamp check (
    (consent = true and consent_given_at is not null)
  )
);

create index if not exists idx_career_applications_career_id
  on public.career_applications(career_id);

create index if not exists idx_career_applications_status
  on public.career_applications(status);

create index if not exists idx_career_applications_created_at
  on public.career_applications(created_at desc);

create table if not exists public.career_application_status_audit (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.career_applications(id) on delete cascade,
  actor_id uuid not null,
  old_status public.career_application_status not null,
  new_status public.career_application_status not null,
  changed_at timestamptz not null default now()
);

create index if not exists idx_career_application_status_audit_application_id
  on public.career_application_status_audit(application_id, changed_at desc);

insert into storage.buckets (id, name, public)
values ('career-applications', 'career-applications', false)
on conflict (id) do update set public = false;

alter table public.career_applications enable row level security;
alter table public.career_application_status_audit enable row level security;

drop policy if exists "Admins manage career applications" on public.career_applications;
create policy "Admins manage career applications"
on public.career_applications
for all
to authenticated
using (
  exists (
    select 1
    from public.system_admins
    where system_admins.id = auth.uid()
      and system_admins.is_admin = true
  )
)
with check (
  exists (
    select 1
    from public.system_admins
    where system_admins.id = auth.uid()
      and system_admins.is_admin = true
  )
);

drop policy if exists "Admins read career application status audit" on public.career_application_status_audit;
create policy "Admins read career application status audit"
on public.career_application_status_audit
for select
to authenticated
using (
  exists (
    select 1
    from public.system_admins
    where system_admins.id = auth.uid()
      and system_admins.is_admin = true
  )
);
