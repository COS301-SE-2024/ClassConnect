<script lang="ts">
  import Card from './workspace/Card.svelte';

  export let data;
</script>


<main class="min-h-screen z-20 p-4 mr-4 mb-4 rounded-xl bg-white shadow-xl px-4 py-6 dark:bg-gray-900">
  <h1 class="text-2xl font-bold dark:text-white">Workspaces</h1>

  <div class="mt-2">
    {#if data.workspaces && data.workspaces.length > 0}
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {#each data.workspaces as workspace}
          <Card {workspace} role={data.role} />
        {/each}
      </div>
    {:else}
      <div class="mt-4 text-center">
        <p class="text-lg text-gray-600 dark:text-gray-400">
          You haven't been assigned to any workspaces yet.
        </p>

        <p class="mt-2 text-sm text-gray-500 dark:text-gray-500">
          Please contact your administrator if you believe this is an error.
        </p>
      </div>
    {/if}
  </div>
</main>