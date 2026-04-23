<script lang="ts">
  import StatsCard from "$lib/components/StatsCard.svelte";
  import RevenueChart from "$lib/components/RevenueChart.svelte";
  import UsersTable from "$lib/components/UsersTable.svelte";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();

  let activeTab = $state<"overview" | "users" | "revenue">("overview");

  let filteredUsers = $derived(
    data.users.filter((u) =>
      activeTab === "users" ? true : u.status === "active"
    )
  );
</script>

<svelte:head><title>Dashboard — Admin</title></svelte:head>

<div class="page-header">
  <h1>Dashboard</h1>
  <nav class="tabs" aria-label="Dashboard sections">
    {#each (["overview", "users", "revenue"] as const) as tab}
      <button
        class="tab"
        class:active={activeTab === tab}
        onclick={() => (activeTab = tab)}
        aria-selected={activeTab === tab}
      >
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </button>
    {/each}
  </nav>
</div>

{#if activeTab === "overview" || activeTab === "revenue"}
  <div class="stats-grid">
    {#each data.stats as stat}
      <StatsCard {stat} />
    {/each}
  </div>

  <div class="charts-row">
    <RevenueChart data={data.revenueByMonth} />
  </div>
{/if}

{#if activeTab === "overview" || activeTab === "users"}
  <UsersTable users={filteredUsers} searchQuery={data.searchQuery} />
{/if}

<style>
  .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem; }
  h1 { font-size: 1.5rem; font-weight: 700; }
  .tabs { display: flex; gap: 0.25rem; background: #f1f5f9; border-radius: 0.5rem; padding: 0.25rem; }
  .tab { padding: 0.375rem 1rem; border: none; background: transparent; border-radius: 0.375rem; cursor: pointer; font-size: 0.875rem; font-weight: 500; color: #64748b; }
  .tab.active { background: white; color: #1e293b; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
  .charts-row { margin-bottom: 1.5rem; }
</style>
