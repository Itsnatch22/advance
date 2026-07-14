-- partner_availability: maps partner slug/name to supported country codes and availability status
CREATE TABLE IF NOT EXISTS public.partner_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner TEXT NOT NULL,
  country_code TEXT NOT NULL,
  available BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_partner_availability_partner ON public.partner_availability(partner);
CREATE INDEX IF NOT EXISTS idx_partner_availability_country ON public.partner_availability(country_code);
