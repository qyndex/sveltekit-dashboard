<script lang="ts">
  import { page } from "$app/stores";

  interface Props { open: boolean; }
  let { open = $bindable(true) }: Props = $props();

  const nav = [
    { href: "/", icon: "⊞", label: "Overview" },
    { href: "/users", icon: "👥", label: "Users" },
    { href: "/revenue", icon: "💰", label: "Revenue" },
    { href: "/settings", icon: "⚙️", label: "Settings" },
  ];
</script>

<aside class="sidebar" class:collapsed={!open} aria-label="Sidebar navigation">
  <div class="brand">
    <span class="logo" aria-hidden="true">◈</span>
    {#if open}<span class="name">AdminKit</span>{/if}
  </div>
  <nav>
    <ul>
      {#each nav as item}
        <li>
          <a
            href={item.href}
            class:active={$page.url.pathname === item.href}
            aria-label={item.label}
            aria-current={$page.url.pathname === item.href ? "page" : undefined}
          >
            <span class="icon" aria-hidden="true">{item.icon}</span>
            {#if open}<span class="nav-label">{item.label}</span>{/if}
          </a>
        </li>
      {/each}
    </ul>
  </nav>
</aside>

<style>
  .sidebar { background: #1e293b; color: white; display: flex; flex-direction: column; overflow: hidden; transition: width 0.2s; }
  .brand { display: flex; align-items: center; gap: 0.75rem; padding: 1.25rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .logo { font-size: 1.5rem; }
  .name { font-weight: 700; font-size: 1.125rem; }
  nav { flex: 1; padding: 1rem 0.5rem; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 0.25rem; }
  a { display: flex; align-items: center; gap: 0.75rem; padding: 0.625rem 0.75rem; border-radius: 0.5rem; color: #94a3b8; text-decoration: none; font-size: 0.875rem; transition: background 0.15s; }
  a:hover { background: rgba(255,255,255,0.08); color: white; }
  a.active { background: rgba(255,255,255,0.12); color: white; }
  .icon { font-size: 1.125rem; width: 1.25rem; flex-shrink: 0; }
</style>
