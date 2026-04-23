<script lang="ts">
  import { onMount } from "svelte";

  interface DataPoint { month: string; revenue: number; }
  interface Props { data: DataPoint[]; }
  let { data }: Props = $props();

  let canvas: HTMLCanvasElement;

  onMount(async () => {
    const { Chart, registerables } = await import("chart.js");
    Chart.register(...registerables);
    new Chart(canvas, {
      type: "line",
      data: {
        labels: data.map((d) => d.month),
        datasets: [
          {
            label: "Revenue",
            data: data.map((d) => d.revenue),
            borderColor: "#1e40af",
            backgroundColor: "rgba(30,64,175,0.08)",
            fill: true,
            tension: 0.4,
            pointBackgroundColor: "#1e40af",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: false,
            ticks: { callback: (v) => `$${(+v / 1000).toFixed(0)}k` },
          },
        },
      },
    });
  });
</script>

<div class="chart-card">
  <h2>Revenue (last 6 months)</h2>
  <div class="canvas-wrapper">
    <canvas bind:this={canvas} aria-label="Revenue over the last 6 months" role="img"></canvas>
  </div>
</div>

<style>
  .chart-card { background: white; border-radius: 0.75rem; padding: 1.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
  h2 { font-size: 1rem; font-weight: 600; margin-bottom: 1.25rem; }
  .canvas-wrapper { position: relative; height: 240px; }
</style>
