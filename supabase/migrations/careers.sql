create table public.careers (
  id uuid not null default gen_random_uuid (),
  title text not null,
  department public.career_department not null,
  employment_type public.career_employment_type not null default 'full-time'::career_employment_type,
  description text not null,
  responsibilities text[] not null default '{}'::text[],
  requirements text[] not null default '{}'::text[],
  skills text[] not null default '{}'::text[],
  apply_link text null,
  apply_email text null default 'support@eaziwage.com'::text,
  is_open boolean not null default true,
  is_featured boolean not null default false,
  posted_date date not null default CURRENT_DATE,
  closing_date date null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  fts tsvector GENERATED ALWAYS as (
    to_tsvector(
      'english'::regconfig,
      (
        (COALESCE(title, ''::text) || ' '::text) || COALESCE(description, ''::text)
      )
    )
  ) STORED null,
  status public.career_status not null default 'open'::career_status,
  experience_level public.career_experience_level null,
  country_code text null,
  city text null,
  work_mode public.career_work_mode not null default 'onsite'::career_work_mode,
  salary_min numeric null,
  salary_max numeric null,
  currency_code text null,
  is_stipend boolean not null default false,
  constraint careers_pkey primary key (id),
  constraint careers_country_code_fkey foreign KEY (country_code) references withdrawal_limits (country_code),
  constraint chk_careers_country_scope check (
    (
      (
        (work_mode = 'remote'::career_work_mode)
        and (country_code is null)
      )
      or (
        (
          work_mode = any (
            array[
              'onsite'::career_work_mode,
              'hybrid'::career_work_mode
            ]
          )
        )
        and (country_code is not null)
      )
    )
  ),
  constraint chk_careers_currency_code_format check (
    (
      (currency_code is null)
      or (currency_code ~ '^[A-Z]{3}$'::text)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_careers_filter on public.careers using btree (
  status,
  country_code,
  department,
  employment_type,
  experience_level
) TABLESPACE pg_default;

create index IF not exists idx_careers_department on public.careers using btree (department) TABLESPACE pg_default;

create index IF not exists idx_careers_employment_type on public.careers using btree (employment_type) TABLESPACE pg_default;

create index IF not exists idx_careers_is_open on public.careers using btree (is_open) TABLESPACE pg_default;

create index IF not exists idx_careers_fts on public.careers using gin (fts) TABLESPACE pg_default;

create trigger trg_careers_updated_at BEFORE
update on careers for EACH row
execute FUNCTION set_careers_updated_at ();

create trigger trg_sync_career_is_open BEFORE INSERT
or
update on careers for EACH row
execute FUNCTION sync_career_is_open ();