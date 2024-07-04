<script lang="ts">
	import Card from '../common/workspace/Card.svelte';
    
	export let data;
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold dark:text-white">Workspaces</h1>
	<div class="mt-2">
		{#if data.workspaces && data.workspaces.length > 0}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each data.workspaces as workspace}
					<Card {workspace} />
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
</div>
