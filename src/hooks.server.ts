import { createSupabaseServer } from "$lib/supabase.server";
import { redirect, type Handle } from "@sveltejs/kit";

/** Routes that do not require authentication */
const PUBLIC_ROUTES = ["/auth/login", "/auth/signup", "/auth/callback"];

export const handle: Handle = async ({ event, resolve }) => {
  const supabase = createSupabaseServer(event.cookies);

  // Attach supabase client to event.locals so load functions can use it
  event.locals.supabase = supabase;

  // Convenience: get the session and attach the user
  const {
    data: { session },
  } = await supabase.auth.getSession();

  event.locals.session = session;
  event.locals.user = session?.user ?? null;

  // Protect non-public routes
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    event.url.pathname.startsWith(route)
  );

  if (!isPublicRoute && !session) {
    throw redirect(303, "/auth/login");
  }

  // If logged in and hitting auth pages, redirect to dashboard
  if (isPublicRoute && session && event.url.pathname !== "/auth/callback") {
    throw redirect(303, "/");
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version";
    },
  });
};
