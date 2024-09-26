<script lang="ts">
	import Card from './workspace/Card.svelte';
	
	export let data;
</script>

<main
	class="z-20 mb-4 ml-4 mr-4 mt-24 min-h-screen rounded-xl bg-white p-4 px-4 py-6 shadow-xl dark:bg-gray-900"
>
	<h1 class="text-2xl font-bold dark:text-white">Workspaces</h1>

	<div class="mt-2">
		{#if data.workspaces && data.workspaces.length > 0}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.workspaces as workspace}
					<Card {workspace} role={data.role}  />
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
