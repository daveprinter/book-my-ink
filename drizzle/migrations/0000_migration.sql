create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,
  created_at timestamptz not null default now(),
  customer_name text not null,
  email text not null,
  phone text not null,
  tattoo_slug text,
  custom_description text,
  placement text,
  size text,
  appointment_date date not null,
  appointment_time text not null,
  price_usd numeric(10,2) not null,
  discount_pct int not null default 0,
  final_price_usd numeric(10,2) not null,
  deposit_usd numeric(10,2) not null,
  balance_usd numeric(10,2) not null,
  payment_method text not null default 'paypal',
  payment_status text not null default 'pending',
  status text not null default 'pending',
  reminders_enabled boolean not null default true,
  notes text
);
grant all on public.bookings to service_role;
alter table public.bookings enable row level security;

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_ref text,
  provider text not null default 'paypal',
  txn_id text,
  amount_usd numeric(10,2),
  status text,
  payer_email text,
  raw jsonb
);
grant all on public.payments to service_role;
alter table public.payments enable row level security;

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  booking_ref text,
  title text not null,
  body text not null
);
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;

create table public.admin_otps (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code_hash text not null,
  expires_at timestamptz not null,
  used boolean not null default false
);
grant all on public.admin_otps to service_role;
alter table public.admin_otps enable row level security;

create table public.admin_sessions (
  token_hash text primary key,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
grant all on public.admin_sessions to service_role;
alter table public.admin_sessions enable row level security;

create table public.site_presence (
  visitor_id text primary key,
  last_seen timestamptz not null default now(),
  path text
);
grant all on public.site_presence to service_role;
alter table public.site_presence enable row level security;