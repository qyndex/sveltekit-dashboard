import { fail, redirect } from "@sveltejs/kit";
import { createSupabaseAdmin } from "$lib/supabase.server";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals: { supabase, session }, url }) => {
  if (!session) {
    throw redirect(303, "/auth/login");
  }

  const searchQuery = url.searchParams.get("q") ?? "";

  // Fetch latest metrics for stats cards
  // Get the most recent period's data for each metric type
  const { data: latestMetrics } = await supabase
    .from("metrics")
    .select("metric_name, value, period")
    .order("recorded_at", { ascending: false })
    .limit(20);

  // Fetch previous period metrics for comparison
  const currentPeriodMetrics = new Map<string, { value: number; period: string }>();
  const previousPeriodMetrics = new Map<string, { value: number; period: string }>();

  if (latestMetrics) {
    for (const m of latestMetrics) {
      if (!currentPeriodMetrics.has(m.metric_name)) {
        currentPeriodMetrics.set(m.metric_name, { value: m.value, period: m.period ?? "" });
      } else if (!previousPeriodMetrics.has(m.metric_name)) {
        previousPeriodMetrics.set(m.metric_name, { value: m.value, period: m.period ?? "" });
      }
    }
  }

  function calcChange(current: number, previous: number | undefined): { change: string; trend: "up" | "down" } {
    if (previous === undefined || previous === 0) return { change: "+0.0%", trend: "up" };
    const pct = ((current - previous) / previous) * 100;
    return {
      change: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
      trend: pct >= 0 ? "up" : "down",
    };
  }

  const revenueVal = currentPeriodMetrics.get("revenue")?.value ?? 0;
  const revenuePrev = previousPeriodMetrics.get("revenue")?.value;
  const usersVal = currentPeriodMetrics.get("active_users")?.value ?? 0;
  const usersPrev = previousPeriodMetrics.get("active_users")?.value;
  const signupsVal = currentPeriodMetrics.get("new_signups")?.value ?? 0;
  const signupsPrev = previousPeriodMetrics.get("new_signups")?.value;
  const churnVal = currentPeriodMetrics.get("churn_rate")?.value ?? 0;
  const churnPrev = previousPeriodMetrics.get("churn_rate")?.value;

  const stats = [
    {
      label: "Total Revenue",
      value: `$${revenueVal.toLocaleString()}`,
      ...calcChange(revenueVal, revenuePrev),
    },
    {
      label: "Active Users",
      value: usersVal.toLocaleString(),
      ...calcChange(usersVal, usersPrev),
    },
    {
      label: "New Signups",
      value: signupsVal.toLocaleString(),
      ...calcChange(signupsVal, signupsPrev),
    },
    {
      label: "Churn Rate",
      value: `${churnVal}%`,
      // For churn, lower is better — invert trend
      change: calcChange(churnVal, churnPrev).change,
      trend: churnVal <= (churnPrev ?? churnVal) ? ("up" as const) : ("down" as const),
    },
  ];

  // Fetch revenue by month for chart
  const { data: revenueRows } = await supabase
    .from("metrics")
    .select("value, period")
    .eq("metric_name", "revenue")
    .order("period", { ascending: true });

  const revenueByMonth = (revenueRows ?? []).map((r) => ({
    month: r.period ? formatMonth(r.period) : "?",
    revenue: r.value,
  }));

  // Fetch user profiles
  let profilesQuery = supabase
    .from("profiles")
    .select("id, full_name, role, avatar_url, created_at")
    .order("created_at", { ascending: false });

  if (searchQuery) {
    profilesQuery = profilesQuery.ilike("full_name", `%${searchQuery}%`);
  }

  const { data: profiles } = await profilesQuery;

  const users = (profiles ?? []).map((p) => ({
    id: p.id,
    name: p.full_name ?? "Unknown",
    email: "", // email is in auth.users, not exposed via profiles
    role: capitalize(p.role),
    status: "active" as const,
    joined: new Date(p.created_at).toISOString().split("T")[0],
    avatar_url: p.avatar_url,
  }));

  return { stats, revenueByMonth, users, searchQuery };
};

export const actions: Actions = {
  logout: async ({ locals: { supabase } }) => {
    await supabase.auth.signOut();
    throw redirect(303, "/auth/login");
  },

  "update-role": async ({ request, cookies, locals: { supabase, session } }) => {
    if (!session) throw redirect(303, "/auth/login");

    // Check if current user is admin
    const { data: currentProfile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (currentProfile?.role !== "admin") {
      return fail(403, { error: "Only admins can change roles." });
    }

    const formData = await request.formData();
    const userId = formData.get("user_id") as string;
    const newRole = formData.get("role") as string;

    if (!userId || !["admin", "editor", "viewer"].includes(newRole)) {
      return fail(400, { error: "Invalid user or role." });
    }

    // Use admin client to bypass RLS for updating another user's profile
    const adminClient = createSupabaseAdmin(cookies);
    const { error } = await adminClient
      .from("profiles")
      .update({ role: newRole as "admin" | "editor" | "viewer" })
      .eq("id", userId);

    if (error) {
      return fail(500, { error: error.message });
    }

    // Audit log
    await supabase.from("audit_log").insert({
      user_id: session.user.id,
      action: "user.role_change",
      details: { target_user: userId, new_role: newRole },
    });

    return { success: true };
  },
};

/** Convert "2024-01" to "Jan" */
function formatMonth(period: string): string {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const monthNum = parseInt(period.split("-")[1], 10);
  return months[monthNum - 1] ?? period;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
