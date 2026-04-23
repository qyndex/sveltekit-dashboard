-- Seed data for SvelteKit Dashboard
-- Note: In a real setup, users are created via Supabase Auth.
-- These profiles assume corresponding auth.users entries exist.
-- For local dev with `supabase db reset`, create test users first via the Auth API
-- or insert into auth.users directly in a seed script.

-- For development: insert profiles directly (assumes auth users are created separately)
-- If using supabase locally, you can create users via the dashboard at localhost:54323

-- Seed metrics: 12 months of revenue data
insert into public.metrics (metric_name, value, period, recorded_at) values
  ('revenue', 42000, '2024-01', '2024-01-31T23:59:59Z'),
  ('revenue', 58000, '2024-02', '2024-02-29T23:59:59Z'),
  ('revenue', 51000, '2024-03', '2024-03-31T23:59:59Z'),
  ('revenue', 67000, '2024-04', '2024-04-30T23:59:59Z'),
  ('revenue', 72000, '2024-05', '2024-05-31T23:59:59Z'),
  ('revenue', 89000, '2024-06', '2024-06-30T23:59:59Z'),
  ('revenue', 95000, '2024-07', '2024-07-31T23:59:59Z'),
  ('revenue', 88000, '2024-08', '2024-08-31T23:59:59Z'),
  ('revenue', 102000, '2024-09', '2024-09-30T23:59:59Z'),
  ('revenue', 110000, '2024-10', '2024-10-31T23:59:59Z'),
  ('revenue', 98000, '2024-11', '2024-11-30T23:59:59Z'),
  ('revenue', 124520, '2024-12', '2024-12-31T23:59:59Z')
on conflict do nothing;

-- Seed metrics: activity stats
insert into public.metrics (metric_name, value, period, recorded_at) values
  ('active_users', 8492, '2024-12', '2024-12-31T23:59:59Z'),
  ('new_signups', 342, '2024-12', '2024-12-31T23:59:59Z'),
  ('churn_rate', 2.1, '2024-12', '2024-12-31T23:59:59Z'),
  ('active_users', 8230, '2024-11', '2024-11-30T23:59:59Z'),
  ('new_signups', 348, '2024-11', '2024-11-30T23:59:59Z'),
  ('churn_rate', 2.5, '2024-11', '2024-11-30T23:59:59Z')
on conflict do nothing;

-- Seed audit log entries
insert into public.audit_log (action, details, created_at) values
  ('system.seed', '{"message": "Database seeded with initial data"}', '2024-12-01T10:00:00Z'),
  ('metrics.import', '{"count": 12, "type": "revenue"}', '2024-12-01T10:01:00Z'),
  ('metrics.import', '{"count": 6, "type": "activity"}', '2024-12-01T10:02:00Z'),
  ('system.startup', '{"version": "0.1.0"}', '2024-12-01T10:03:00Z'),
  ('config.update', '{"key": "dashboard.theme", "value": "default"}', '2024-12-02T09:00:00Z'),
  ('user.login', '{"method": "email"}', '2024-12-03T08:30:00Z'),
  ('user.login', '{"method": "email"}', '2024-12-03T14:15:00Z'),
  ('config.update', '{"key": "notifications.enabled", "value": true}', '2024-12-04T11:00:00Z'),
  ('metrics.export', '{"format": "csv", "rows": 100}', '2024-12-05T16:30:00Z'),
  ('system.backup', '{"size_mb": 42, "duration_s": 12}', '2024-12-06T02:00:00Z')
on conflict do nothing;
