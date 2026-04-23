import { test, expect } from "@playwright/test";

test.describe("Auth pages", () => {
  test("unauthenticated users are redirected to login", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test("login page has correct title", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page).toHaveTitle(/Log In/);
  });

  test("login page renders heading and form", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign in" })).toBeVisible();
  });

  test("login page has link to signup", async ({ page }) => {
    await page.goto("/auth/login");
    await expect(page.getByRole("link", { name: "Sign up" })).toBeVisible();
  });

  test("signup page renders heading and form", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByRole("heading", { name: "Create an account" })).toBeVisible();
    await expect(page.getByLabel("Full name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
  });

  test("signup page has link to login", async ({ page }) => {
    await page.goto("/auth/signup");
    await expect(page.getByRole("link", { name: "Sign in" })).toBeVisible();
  });
});
