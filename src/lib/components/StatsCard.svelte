<script lang="ts">
  interface Stat { label: string; value: string; change: string; trend: "up" | "down"; }
  interface Props { stat: Stat; }
  let { stat }: Props = $props();
</script>

<div class="card" role="region" aria-label={stat.label}>
  <p class="label">{stat.label}</p>
  <p class="value">{stat.value}</p>
  <p class="change" class:up={stat.trend === "up"} class:down={stat.trend === "down"}>
    {stat.trend === "up" ? "↑" : "↓"} {stat.change}
  </p>
</div>

<style>
  .card { background: white; border-radius: 0.75rem; padding: 1.25rem 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  .label { font-size: 0.8125rem; color: #94a3b8; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
  .value { font-size: 1.75rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
  .change { font-size: 0.875rem; font-weight: 500; }
  .up { color: #16a34a; }
  .down { color: #dc2626; }
</style>
