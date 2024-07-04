<script lang="ts">
	import type { PageData } from './$types';
	import { Button } from 'flowbite-svelte';

	import DeleteModal from '$lib/components/admin/modals/Delete.svelte';
	import EditModal from '$lib/components/admin/modals/organisation/Edit.svelte';
	import CreateModal from '$lib/components/admin/modals/organisation/Add.svelte';

	export let data: PageData;

	let isEditModalOpen = false;
	let isCreateModalOpen = false;
	let isDeleteModalOpen = false;

	$: ({ id, name, image } = data);
</script>

<main class="container mx-auto px-4 py-8">
	{#if id}
		<div class="flex flex-col items-center">
			<img src={image} alt="{name} logo" class="mb-4 h-32 w-32 rounded-full" />

			<h1 class="mb-6 text-3xl font-bold text-gray-800 dark:text-white">{name}</h1>

			<div class="flex space-x-4">
				<Button on:click={() => (isEditModalOpen = true)}>Edit</Button>
				<Button color="red" on:click={() => (isDeleteModalOpen = true)}>Delete</Button>
			</div>
		</div>
	{:else}
		<div class="text-center">
			<h2 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				You do not have an organisation yet
			</h2>

			<Button on:click={() => (isCreateModalOpen = true)}>Create Organisation</Button>
		</div>
	{/if}
</main>

<CreateModal bind:open={isCreateModalOpen} />
<EditModal bind:open={isEditModalOpen} {id} />
<DeleteModal bind:open={isDeleteModalOpen} {id} item="organisation" />
