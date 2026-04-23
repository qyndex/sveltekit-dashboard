import { render, screen } from "@testing-library/svelte";
import { describe, it, expect } from "vitest";
import StatsCard from "./StatsCard.svelte";

const upStat = {
  label: "Total Revenue",
  value: "$124,520",
  change: "+12.5%",
  trend: "up" as const,
};

const downStat = {
  label: "Churn Rate",
  value: "2.1%",
  change: "-0.4%",
  trend: "down" as const,
};

describe("StatsCard", () => {
  it("renders the label", () => {
    render(StatsCard, { props: { stat: upStat } });
    expect(screen.getByText("Total Revenue")).toBeTruthy();
  });

  it("renders the value", () => {
    render(StatsCard, { props: { stat: upStat } });
    expect(screen.getByText("$124,520")).toBeTruthy();
  });

  it("renders the change with up arrow for upward trend", () => {
    render(StatsCard, { props: { stat: upStat } });
    expect(screen.getByText(/↑/)).toBeTruthy();
    expect(screen.getByText(/\+12\.5%/)).toBeTruthy();
  });

  it("renders the change with down arrow for downward trend", () => {
    render(StatsCard, { props: { stat: downStat } });
    expect(screen.getByText(/↓/)).toBeTruthy();
    expect(screen.getByText(/-0\.4%/)).toBeTruthy();
  });

  it("has an accessible region label", () => {
    render(StatsCard, { props: { stat: upStat } });
    const region = screen.getByRole("region", { name: "Total Revenue" });
    expect(region).toBeTruthy();
  });

  it("has an accessible region label for down stat", () => {
    render(StatsCard, { props: { stat: downStat } });
    const region = screen.getByRole("region", { name: "Churn Rate" });
    expect(region).toBeTruthy();
  });
});
