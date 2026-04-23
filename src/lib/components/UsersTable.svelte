<script lang="ts">
  import { enhance } from "$app/forms";
  import { goto } from "$app/navigation";

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    joined: string;
    avatar_url?: string | null;
  }
  interface Props {
    users: User[];
    searchQuery?: string;
  }
  let { users, searchQuery = "" }: Props = $props();

  let search = $state(searchQuery);
  let editingUserId = $state<string | null>(null);
  let roleActionError = $state<string | null>(null);

  // Client-side filter on top of server-side results
  let filtered = $derived(
    users.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    )
  );

  function handleSearch() {
    // Trigger server-side search via URL params
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("q", search.trim());
    }
    const qs = params.toString();
    goto(qs ? `/?${qs}` : "/", { replaceState: true, invalidateAll: true });
  }

  let debounceTimer: ReturnType<typeof setTimeout>;
  function onSearchInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(handleSearch, 300);
  }
</script>

<div class="table-wrapper" role="region" aria-label="Users table">
  <div class="toolbar">
    <h2>Users</h2>
    <input
      type="search"
      bind:value={search}
      oninput={onSearchInput}
      placeholder="Search users..."
      aria-label="Search users"
      class="search"
    />
  </div>

  {#if roleActionError}
    <div class="error-bar" role="alert">{roleActionError}</div>
  {/if}

  <table>
    <thead>
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Email</th>
        <th scope="col">Role</th>
        <th scope="col">Status</th>
        <th scope="col">Joined</th>
        <th scope="col"><span class="sr-only">Actions</span></th>
      </tr>
    </thead>
    <tbody>
      {#each filtered as user (user.id)}
        <tr>
          <td>
            <div class="user-cell">
              {#if user.avatar_url}
                <img src={user.avatar_url} alt="" class="avatar" />
              {:else}
                <span class="avatar-placeholder" aria-hidden="true">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              {/if}
              {user.name}
            </div>
          </td>
          <td>{user.email || "-"}</td>
          <td>
            {#if editingUserId === user.id}
              <form
                method="POST"
                action="?/update-role"
                use:enhance={() => {
                  return async ({ result }) => {
                    if (result.type === "failure") {
                      roleActionError = (result.data as { error?: string })?.error ?? "Failed to update role.";
                    } else {
                      editingUserId = null;
                      roleActionError = null;
                    }
                  };
                }}
              >
                <input type="hidden" name="user_id" value={user.id} />
                <select name="role" class="role-select" aria-label="Select role for {user.name}">
                  {#each ["admin", "editor", "viewer"] as r}
                    <option value={r} selected={user.role.toLowerCase() === r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  {/each}
                </select>
                <button type="submit" class="btn-sm save" aria-label="Save role">Save</button>
                <button type="button" class="btn-sm cancel" onclick={() => (editingUserId = null)} aria-label="Cancel">Cancel</button>
              </form>
            {:else}
              {user.role}
            {/if}
          </td>
          <td><span class="badge" class:active={user.status === "active"}>{user.status}</span></td>
          <td>{user.joined}</td>
          <td>
            {#if editingUserId !== user.id}
              <button
                class="btn-sm edit"
                onclick={() => (editingUserId = user.id)}
                aria-label="Edit role for {user.name}"
              >
                Edit
              </button>
            {/if}
          </td>
        </tr>
      {:else}
        <tr><td colspan="6" class="empty">No users found.</td></tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .table-wrapper { background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.06); overflow: hidden; }
  .toolbar { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #f1f5f9; }
  h2 { font-size: 1rem; font-weight: 600; }
  .search { padding: 0.5rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem; }
  .error-bar { background: #fef2f2; color: #dc2626; padding: 0.5rem 1.5rem; font-size: 0.8125rem; border-bottom: 1px solid #fecaca; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 0.75rem 1.5rem; font-size: 0.75rem; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; background: #f8fafc; }
  td { padding: 0.875rem 1.5rem; font-size: 0.9375rem; color: #374151; border-bottom: 1px solid #f1f5f9; }
  .user-cell { display: flex; align-items: center; gap: 0.625rem; }
  .avatar { width: 2rem; height: 2rem; border-radius: 9999px; object-fit: cover; }
  .avatar-placeholder { width: 2rem; height: 2rem; border-radius: 9999px; background: #e2e8f0; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 600; flex-shrink: 0; }
  .badge { padding: 0.25rem 0.625rem; border-radius: 9999px; font-size: 0.75rem; font-weight: 500; background: #f1f5f9; color: #64748b; }
  .badge.active { background: #dcfce7; color: #166534; }
  .empty { text-align: center; color: #94a3b8; padding: 2rem; }
  .role-select { padding: 0.25rem 0.5rem; border: 1px solid #e2e8f0; border-radius: 0.375rem; font-size: 0.8125rem; }
  .btn-sm { padding: 0.25rem 0.5rem; border: none; border-radius: 0.375rem; font-size: 0.75rem; font-weight: 500; cursor: pointer; }
  .btn-sm.edit { background: #f1f5f9; color: #475569; }
  .btn-sm.edit:hover { background: #e2e8f0; }
  .btn-sm.save { background: #1e40af; color: white; margin-left: 0.25rem; }
  .btn-sm.save:hover { background: #1e3a8a; }
  .btn-sm.cancel { background: #f1f5f9; color: #475569; margin-left: 0.25rem; }
  .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); border: 0; }

  form { display: flex; align-items: center; gap: 0.25rem; }
</style>
