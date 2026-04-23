import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

/**
 * Auth callback handler for email confirmation and OAuth flows.
 * Supabase redirects here with a code that we exchange for a session.
 */
export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code");

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  }

  throw redirect(303, "/");
};
