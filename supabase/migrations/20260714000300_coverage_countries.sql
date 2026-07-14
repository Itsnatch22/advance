-- Adds coverage_countries to persist counts for the coverage map
CREATE TABLE IF NOT EXISTS public.coverage_countries (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  last_count INTEGER DEFAULT 0 NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_coverage_countries_updated_at ON public.coverage_countries(updated_at);

-- Insert baseline rows for supported countries
INSERT INTO public.coverage_countries (code, name, last_count)
VALUES
('KE', 'Kenya', 0),
('UG', 'Uganda', 0),
('TZ', 'Tanzania', 0),
('RW', 'Rwanda', 0)
ON CONFLICT (code) DO NOTHING;
