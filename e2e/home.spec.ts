import { test, expect } from "@playwright/test";

test.describe("Dashboard home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct page title", async ({ page }) => {
    await expect(page).toHaveTitle(/Dashboard/);
  });

  test("renders the main heading", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
  });

  test("renders all four stats cards", async ({ page }) => {
    await expect(page.getByRole("region", { name: "Total Revenue" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Active Users" })).toBeVisible();
    await expect(page.getByRole("region", { name: "New Signups" })).toBeVisible();
    await expect(page.getByRole("region", { name: "Churn Rate" })).toBeVisible();
  });

  test("shows revenue stat value", async ({ page }) => {
    await expect(page.getByText("$124,520")).toBeVisible();
  });

  test("renders the tab navigation", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Dashboard sections" });
    await expect(nav).toBeVisible();
    await expect(nav.getByRole("button", { name: "Overview" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Users" })).toBeVisible();
    await expect(nav.getByRole("button", { name: "Revenue" })).toBeVisible();
  });

  test("Overview tab is active by default", async ({ page }) => {
    const overviewBtn = page.getByRole("button", { name: "Overview" });
    await expect(overviewBtn).toHaveAttribute("aria-selected", "true");
  });

  test("clicking Users tab changes active tab", async ({ page }) => {
    const usersBtn = page.getByRole("button", { name: "Users" });
    await usersBtn.click();
    await expect(usersBtn).toHaveAttribute("aria-selected", "true");
    const overviewBtn = page.getByRole("button", { name: "Overview" });
    await expect(overviewBtn).toHaveAttribute("aria-selected", "false");
  });

  test("renders the users table", async ({ page }) => {
    await expect(page.getByRole("region", { name: "Users table" })).toBeVisible();
  });

  test("users table has search input", async ({ page }) => {
    await expect(page.getByRole("searchbox", { name: "Search users" })).toBeVisible();
  });

  test("users table shows user names", async ({ page }) => {
    await expect(page.getByText("Alice Chen")).toBeVisible();
  });

  test("sidebar navigation is present", async ({ page }) => {
    await expect(page.getByRole("complementary", { name: "Sidebar navigation" })).toBeVisible();
  });

  test("sidebar has Overview nav link", async ({ page }) => {
    const sidebar = page.getByRole("complementary", { name: "Sidebar navigation" });
    await expect(sidebar.getByRole("link", { name: "Overview" })).toBeVisible();
  });

  test("revenue chart canvas is rendered", async ({ page }) => {
    const canvas = page.getByRole("img", { name: "Revenue over the last 6 months" });
    await expect(canvas).toBeVisible();
  });

  test("searching in users table filters results", async ({ page }) => {
    const search = page.getByRole("searchbox", { name: "Search users" });
    await search.fill("alice");
    await expect(page.getByText("Alice Chen")).toBeVisible();
    await expect(page.getByText("Bob Smith")).not.toBeVisible();
  });
});
