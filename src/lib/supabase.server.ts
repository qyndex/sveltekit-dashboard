import { createServerClient } from "@supabase/ssr";
import { env } from "$env/dynamic/public";
import { env as privateEnv } from "$env/dynamic/private";
import type { Cookies } from "@sveltejs/kit";
import type { Database } from "$lib/types/database";

export function createSupabaseServer(cookies: Cookies) {
  return createServerClient<Database>(
    env.PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
    env.PUBLIC_SUPABASE_ANON_KEY ?? "placeholder",
    {
      cookies: {
        getAll() {
          return cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, { ...options, path: options?.path ?? "/" });
          });
        },
      },
    }
  );
}

export function createSupabaseAdmin(cookies: Cookies) {
  const serviceRoleKey = privateEnv.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required for admin operations");
  }
  return createServerClient<Database>(
    env.PUBLIC_SUPABASE_URL ?? "http://localhost:54321",
    serviceRoleKey,
    {
      cookies: {
        getAll() {
          return cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookies.set(name, value, { ...options, path: options?.path ?? "/" });
          });
        },
      },
    }
  );
}
