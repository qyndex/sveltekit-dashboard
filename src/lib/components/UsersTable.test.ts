import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import UsersTable from "./UsersTable.svelte";

const users = [
  { id: "1", name: "Alice Chen", email: "alice@example.com", role: "Admin", status: "active", joined: "2025-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "active", joined: "2025-02-20" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "Viewer", status: "inactive", joined: "2025-03-05" },
];

describe("UsersTable", () => {
  it("renders all users by default", () => {
    render(UsersTable, { props: { users } });
    expect(screen.getByText("Alice Chen")).toBeTruthy();
    expect(screen.getByText("Bob Smith")).toBeTruthy();
    expect(screen.getByText("Carol White")).toBeTruthy();
  });

  it("renders table column headers", () => {
    render(UsersTable, { props: { users } });
    expect(screen.getByText("Name")).toBeTruthy();
    expect(screen.getByText("Email")).toBeTruthy();
    expect(screen.getByText("Role")).toBeTruthy();
    expect(screen.getByText("Status")).toBeTruthy();
    expect(screen.getByText("Joined")).toBeTruthy();
  });

  it("renders email addresses", () => {
    render(UsersTable, { props: { users } });
    expect(screen.getByText("alice@example.com")).toBeTruthy();
  });

  it("renders role values", () => {
    render(UsersTable, { props: { users } });
    expect(screen.getByText("Admin")).toBeTruthy();
    expect(screen.getByText("Editor")).toBeTruthy();
    expect(screen.getByText("Viewer")).toBeTruthy();
  });

  it("shows empty state when user list is empty", () => {
    render(UsersTable, { props: { users: [] } });
    expect(screen.getByText("No users found.")).toBeTruthy();
  });

  it("has an accessible search input", () => {
    render(UsersTable, { props: { users } });
    expect(screen.getByRole("searchbox", { name: "Search users" })).toBeTruthy();
  });

  it("has an accessible region wrapper", () => {
    render(UsersTable, { props: { users } });
    expect(screen.getByRole("region", { name: "Users table" })).toBeTruthy();
  });

  it("filters users when searching by name", async () => {
    render(UsersTable, { props: { users } });
    const search = screen.getByRole("searchbox", { name: "Search users" });
    await userEvent.type(search, "alice");
    expect(screen.getByText("Alice Chen")).toBeTruthy();
    expect(screen.queryByText("Bob Smith")).toBeNull();
    expect(screen.queryByText("Carol White")).toBeNull();
  });

  it("filters users when searching by email", async () => {
    render(UsersTable, { props: { users } });
    const search = screen.getByRole("searchbox", { name: "Search users" });
    await userEvent.type(search, "bob@");
    expect(screen.getByText("Bob Smith")).toBeTruthy();
    expect(screen.queryByText("Alice Chen")).toBeNull();
  });

  it("search is case-insensitive", async () => {
    render(UsersTable, { props: { users } });
    const search = screen.getByRole("searchbox", { name: "Search users" });
    await userEvent.type(search, "CAROL");
    expect(screen.getByText("Carol White")).toBeTruthy();
  });

  it("shows empty state when search matches nothing", async () => {
    render(UsersTable, { props: { users } });
    const search = screen.getByRole("searchbox", { name: "Search users" });
    await userEvent.type(search, "zzznomatch");
    expect(screen.getByText("No users found.")).toBeTruthy();
  });
});
