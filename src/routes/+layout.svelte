<script lang="ts">
  import "../app.css";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import Topbar from "$lib/components/Topbar.svelte";

  let { children } = $props();

  let sidebarOpen = $state(true);
</script>

<div class="layout" class:sidebar-collapsed={!sidebarOpen}>
  <Sidebar bind:open={sidebarOpen} />
  <div class="main">
    <Topbar on:toggle={() => (sidebarOpen = !sidebarOpen)} />
    <main class="content">
      {@render children()}
    </main>
  </div>
</div>

<style>
  .layout { display: grid; grid-template-columns: 240px 1fr; min-height: 100vh; }
  .layout.sidebar-collapsed { grid-template-columns: 64px 1fr; }
  .main { display: flex; flex-direction: column; min-width: 0; }
  .content { flex: 1; padding: 1.5rem; background: #f8fafc; overflow-y: auto; }
</style>
