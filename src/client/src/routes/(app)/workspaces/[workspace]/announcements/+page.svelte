<script lang="ts">
	import { Button } from 'flowbite-svelte';
	import Card from '$src/lib/components/announcements/Card.svelte';
	import AddModal from '$lib/components/modals/announcement/Add.svelte';

	export let data: any;

	let isAddModalOpen = false;
	$: ({ announcements } = data);
</script>

<main class="container mx-auto my-2 px-4">
	{#if announcements.length === 0}
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				You do not have any Announcements in the workspace
			</h1>
			{#if data.role === 'lecturer'}
				<Button on:click={() => (isAddModalOpen = true)}>Create Announcement</Button>
			{/if}
		</div>
	{:else}

		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-3xl font-bold text-gray-800 dark:text-white">Announcements</h2>
					<span
						class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>
						{announcements.length}
						{announcements.length === 1 ? 'announcement' : 'announcements'}
					</span>
				</div>
			</div>
			<div class="mb-4 flex items-center gap-x-3">
				{#if data.role === 'lecturer'}
					<Button on:click={() => (isAddModalOpen = true)} class='font-bold'>Create Announcement</Button>
				{/if}
			</div>
		</div>

		{#each announcements as announcement (announcement.id)}
			<Card
				date={announcement.date}
				title={announcement.title}
				description={announcement.description}
				id={announcement.id}
				role={data.role}
			></Card>
		{/each}
	{/if}
</main>

<AddModal bind:open={isAddModalOpen} />
