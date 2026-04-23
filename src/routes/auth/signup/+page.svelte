<script lang="ts">
  import { enhance } from "$app/forms";
  import type { ActionData } from "./$types";

  let { form }: { form: ActionData } = $props();
  let loading = $state(false);
</script>

<svelte:head><title>Sign Up</title></svelte:head>

<div class="auth-container">
  <div class="auth-card">
    <div class="auth-header">
      <span class="logo" aria-hidden="true">&#9672;</span>
      <h1>Create an account</h1>
      <p>Get started with your dashboard</p>
    </div>

    {#if form?.error}
      <div class="error-banner" role="alert">{form.error}</div>
    {/if}

    {#if form?.success}
      <div class="success-banner" role="status">
        Check your email to confirm your account, then <a href="/auth/login">sign in</a>.
      </div>
    {:else}
      <form
        method="POST"
        use:enhance={() => {
          loading = true;
          return async ({ update }) => {
            loading = false;
            await update();
          };
        }}
      >
        <div class="field">
          <label for="full_name">Full name</label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            required
            autocomplete="name"
            placeholder="Jane Doe"
            value={form?.full_name ?? ""}
          />
        </div>

        <div class="field">
          <label for="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autocomplete="email"
            placeholder="you@example.com"
            value={form?.email ?? ""}
          />
        </div>

        <div class="field">
          <label for="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autocomplete="new-password"
            placeholder="At least 6 characters"
            minlength="6"
          />
        </div>

        <button type="submit" class="submit-btn" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    {/if}

    <p class="footer-text">
      Already have an account? <a href="/auth/login">Sign in</a>
    </p>
  </div>
</div>

<style>
  .auth-container { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; padding: 1rem; }
  .auth-card { background: white; border-radius: 0.75rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); padding: 2rem; width: 100%; max-width: 24rem; }
  .auth-header { text-align: center; margin-bottom: 1.5rem; }
  .logo { font-size: 2rem; display: block; margin-bottom: 0.5rem; }
  h1 { font-size: 1.25rem; font-weight: 700; color: #1e293b; margin-bottom: 0.25rem; }
  .auth-header p { font-size: 0.875rem; color: #64748b; }
  .error-banner { background: #fef2f2; border: 1px solid #fecaca; color: #dc2626; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; margin-bottom: 1rem; }
  .success-banner { background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; margin-bottom: 1rem; }
  .success-banner a { color: #166534; font-weight: 600; }
  .field { margin-bottom: 1rem; }
  label { display: block; font-size: 0.875rem; font-weight: 500; color: #374151; margin-bottom: 0.375rem; }
  input { width: 100%; padding: 0.625rem 0.75rem; border: 1px solid #e2e8f0; border-radius: 0.5rem; font-size: 0.875rem; color: #1e293b; }
  input:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }
  .submit-btn { width: 100%; padding: 0.625rem; background: #1e40af; color: white; border: none; border-radius: 0.5rem; font-size: 0.875rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem; }
  .submit-btn:hover:not(:disabled) { background: #1e3a8a; }
  .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .footer-text { text-align: center; font-size: 0.875rem; color: #64748b; margin-top: 1.25rem; }
  .footer-text a { color: #1e40af; text-decoration: none; font-weight: 500; }
  .footer-text a:hover { text-decoration: underline; }
</style>
