<script lang="ts">
	import { Button } from 'flowbite-svelte';

	import Card from '$src/lib/components/announcements/Card.svelte';
	import AddModal from '$lib/components/modals/announcement/Add.svelte';

	export let data: any;
	export let view: string;

	let isAddModalOpen = false;

	$: ({ id, role, announcements } = data);
</script>

<main class="container mx-auto my-2 mt-24 px-4">
	{#if announcements.length === 0}
		<div
			class="flex h-full w-full flex-col items-center justify-center space-x-8 space-y-16 lg:flex-row lg:space-y-0 2xl:space-x-0"
		>
			<div
				class="flex w-full flex-col items-center justify-center text-center lg:w-1/2 lg:px-2 xl:px-0"
			>
				<p class="mb-10 mt-2 text-4xl font-bold tracking-wider text-gray-300">
					No Announcements Found
				</p>

				{#if view === role}
					<Button on:click={() => (isAddModalOpen = true)}>Create Announcement</Button>
				{/if}
			</div>
		</div>
	{:else}
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Announcements</h2>

					<span
						class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>
						{announcements.length}
						{announcements.length === 1 ? 'announcement' : 'announcements'}
					</span>
				</div>

				<p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
					Stay updated with the latest news and information.
				</p>
			</div>

			<div class="mb-4 flex items-center gap-x-3">
				{#if view === role}
					<Button on:click={() => (isAddModalOpen = true)}>Create Announcement</Button>
				{/if}
			</div>
		</div>

		{#each announcements as announcement (announcement.id)}
			<Card {role} {announcement} />
		{/each}
	{/if}
</main>

<AddModal bind:open={isAddModalOpen} {id} />
