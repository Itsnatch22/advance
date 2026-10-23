create table public.career_applications (
  id uuid not null default gen_random_uuid (),
  career_id uuid null,
  career_title_snapshot text not null,
  career_slug_snapshot text not null,
  full_name text not null,
  email text not null,
  phone text null,
  resume_url text not null,
  cover_letter text null,
  linkedin_url text null,
  portfolio_url text null,
  status public.career_application_status not null default 'submitted'::career_application_status,
  consent boolean not null default false,
  consent_given_at timestamp with time zone null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint career_applications_pkey primary key (id),
  constraint career_applications_career_id_fkey foreign KEY (career_id) references careers (id) on delete set null
) TABLESPACE pg_default;

create index IF not exists idx_career_applications_career_id on public.career_applications using btree (career_id) TABLESPACE pg_default;

create index IF not exists idx_career_applications_status on public.career_applications using btree (status) TABLESPACE pg_default;

create index IF not exists idx_career_applications_email on public.career_applications using btree (email) TABLESPACE pg_default;

create trigger trg_career_applications_updated_at BEFORE
update on career_applications for EACH row
execute FUNCTION set_updated_at ();