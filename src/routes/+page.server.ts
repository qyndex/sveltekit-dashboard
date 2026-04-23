import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ fetch }) => {
  // In production, fetch from your API or database
  const stats = [
    { label: "Total Revenue", value: "$124,520", change: "+12.5%", trend: "up" },
    { label: "Active Users", value: "8,492", change: "+3.2%", trend: "up" },
    { label: "New Signups", value: "342", change: "-1.8%", trend: "down" },
    { label: "Churn Rate", value: "2.1%", change: "-0.4%", trend: "up" },
  ];

  const revenueByMonth = [
    { month: "Jan", revenue: 42000 },
    { month: "Feb", revenue: 58000 },
    { month: "Mar", revenue: 51000 },
    { month: "Apr", revenue: 67000 },
    { month: "May", revenue: 72000 },
    { month: "Jun", revenue: 89000 },
  ];

  const users = [
    { id: "1", name: "Alice Chen", email: "alice@example.com", role: "Admin", status: "active", joined: "2025-01-15" },
    { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "active", joined: "2025-02-20" },
    { id: "3", name: "Carol White", email: "carol@example.com", role: "Viewer", status: "inactive", joined: "2025-03-05" },
    { id: "4", name: "Dave Brown", email: "dave@example.com", role: "Editor", status: "active", joined: "2025-04-10" },
  ];

  return { stats, revenueByMonth, users };
};
