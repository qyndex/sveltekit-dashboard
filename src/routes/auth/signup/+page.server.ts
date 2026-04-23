import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ request, locals: { supabase } }) => {
    const formData = await request.formData();
    const full_name = formData.get("full_name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!full_name || !email || !password) {
      return fail(400, {
        error: "All fields are required.",
        email,
        full_name,
      });
    }

    if (password.length < 6) {
      return fail(400, {
        error: "Password must be at least 6 characters.",
        email,
        full_name,
      });
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name },
      },
    });

    if (error) {
      return fail(400, { error: error.message, email, full_name });
    }

    return { success: true, email: "", full_name: "" };
  },
};
