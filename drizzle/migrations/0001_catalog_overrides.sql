CREATE TABLE public.tattoo_overrides (
  slug text PRIMARY KEY,
  name text,
  price numeric,
  image_url text,
  details text,
  meaning text,
  motivation text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.tattoo_overrides TO anon, authenticated;
GRANT ALL ON public.tattoo_overrides TO service_role;
ALTER TABLE public.tattoo_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read overrides" ON public.tattoo_overrides FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);