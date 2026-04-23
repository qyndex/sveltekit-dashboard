-- Initial schema for SvelteKit Dashboard
-- Tables: profiles, metrics, audit_log

-- Create profiles table (extends Supabase auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'viewer' check (role in ('admin', 'editor', 'viewer')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Create metrics table for dashboard stats
create table if not exists public.metrics (
  id uuid primary key default gen_random_uuid(),
  metric_name text not null,
  value numeric not null,
  period text,
  recorded_at timestamptz not null default now()
);

-- Create audit_log table for tracking user actions
create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  details jsonb default '{}',
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_metrics_name_period on public.metrics(metric_name, period);
create index if not exists idx_metrics_recorded_at on public.metrics(recorded_at);
create index if not exists idx_audit_log_user_id on public.audit_log(user_id);
create index if not exists idx_audit_log_created_at on public.audit_log(created_at);

-- RLS policies for profiles
alter table public.profiles enable row level security;

create policy "Users can view all profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Only admins can insert profiles (besides the trigger)
create policy "Service role can insert profiles"
  on public.profiles for insert
  to authenticated
  with check (auth.uid() = id);

-- RLS policies for metrics
alter table public.metrics enable row level security;

create policy "Authenticated users can view metrics"
  on public.metrics for select
  to authenticated
  using (true);

create policy "Admins can insert metrics"
  on public.metrics for insert
  to authenticated
  with check (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- RLS policies for audit_log
alter table public.audit_log enable row level security;

create policy "Admins can view audit logs"
  on public.audit_log for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Authenticated users can insert audit logs"
  on public.audit_log for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
