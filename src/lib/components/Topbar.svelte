<script lang="ts">
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";

  interface Props {
    ontoggle?: () => void;
  }
  let { ontoggle }: Props = $props();

  let user = $derived($page.data.user);
  let userEmail = $derived(user?.email ?? "");
</script>

<header class="topbar" role="banner">
  <button
    class="toggle-btn"
    onclick={() => ontoggle?.()}
    aria-label="Toggle sidebar"
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
  </button>

  <div class="spacer"></div>

  {#if userEmail}
    <span class="user-email">{userEmail}</span>
    <form method="POST" action="?/logout" use:enhance>
      <button type="submit" class="logout-btn" aria-label="Log out">
        Log out
      </button>
    </form>
  {/if}
</header>

<style>
  .topbar { display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1.5rem; background: white; border-bottom: 1px solid #f1f5f9; }
  .toggle-btn { border: none; background: transparent; cursor: pointer; color: #64748b; padding: 0.375rem; border-radius: 0.375rem; display: flex; align-items: center; }
  .toggle-btn:hover { background: #f1f5f9; color: #1e293b; }
  .spacer { flex: 1; }
  .user-email { font-size: 0.8125rem; color: #64748b; }
  .logout-btn { border: 1px solid #e2e8f0; background: white; padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.8125rem; color: #475569; cursor: pointer; font-weight: 500; }
  .logout-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
</style>
