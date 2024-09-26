<script lang="ts">
	import Card from './workspace/Card.svelte';
	import { handleMouseEnter } from '$utils/keyboard';
	export let data;
</script>

<main class="z-20 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
	<h1 class="mb-8 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
		Your Workspaces
	</h1>
	<div class="mt-2">
		{#if data.workspaces && data.workspaces.length > 0}
			<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each data.workspaces as workspace}
					<Card {workspace} role={data.role} on:focus={() => handleMouseEnter(workspace.name)} />
				{/each}
			</div>
		{:else}
			<div class="mt-8 rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
				<p class="text-xl text-gray-700 dark:text-gray-300">No learning spaces assigned yet.</p>
				<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
					If you think this is an error, please contact your instructor or administrator.
				</p>
			</div>
		{/if}
	</div>
</main>
