<script lang="ts">
  interface User { id: string; name: string; email: string; role: string; status: string; joined: string; }
  interface Props { users: User[]; }
  let { users }: Props = $props();

  let search = $state("");
  let filtered = $derived(
    users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )
  );
</script>

<div class="table-wrapper" role="region" aria-label="Users table">
  <div class="toolbar">
    <h2>Users</h2>
    <input
      type="search"
      bind:value={search}
      placeholder="Search users…"
      aria-label="Search users"
      class="search"
    />
  </div>
  <table>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>
        <th scope="col">Joined</th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as user (user.id)}
        <tr>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.role}</td>
          <td><span class="badge" class:active={user.status === "active"}>{user.status}</span></td>
          <td>{user.joined}</td>
        </tr>
      {:else}
        <tr><td colspan="5" class="empty">No users found.</td></tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-wrapper { background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow: hidden; }
  .toolbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
  h2 { font-size: 1rem; font-weight: 600; }
  .search { padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 0.75rem 1.5rem; font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; background: #f8fafc; }
  td { padding: 0.875rem 1.5rem; font-size: 0.9375rem; color: #374151; border-bottom: 1px solid #f1f5f9; }
  .badge { padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; background: #f1f5f9; color: #64748b; }
  .badge.active { background: #dcfce7; color: #166534; }
  .empty { text-align: center; color: #94a3b8; padding: 2rem; }
</style>
