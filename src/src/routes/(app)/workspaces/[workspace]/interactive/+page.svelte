<script lang="ts">
	import InteractiveLessons from '$src/lib/components/interactive/InteractiveLessons.svelte';
	import CreateModal from '$lib/components/modals/interactive/CreateModal.svelte';
	import { Button } from 'flowbite-svelte';

	let isCreateModalOpen = false;

	export let data: any;

	$: ({ role, interactive } = data);
</script>

<main class="container mx-auto p-4">
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Practice Material</h2>
				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
				>
					{interactive.length} Practice material
				</span>
			</div>
		</div>
		{#if role === 'lecturer'}
			<Button size="sm" on:click={() => (isCreateModalOpen = true)}>Create Practice Material</Button>
		{/if}
	</div>
	<br />

	{#if interactive.length === 0}
		<p class="text-l text-gray-800 dark:text-white">
			There are no practice material available at the moment.
		</p>
	{:else}
		<InteractiveLessons lessons={interactive} {role} />
	{/if}
</main>

<CreateModal bind:open={isCreateModalOpen} />
