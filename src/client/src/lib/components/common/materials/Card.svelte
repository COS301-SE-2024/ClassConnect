<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import RemoveModal from '$lib/components/admin/modals/Delete.svelte';
	import { Button } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { selectForDelete } from '$lib/store/materials';

	export let title;
	export let description;
	export let id: string;
	export let role: string;

	let isRemoveModalOpen = false;

	function handleRemoveModalOpen(lectureId: string) {
		isRemoveModalOpen = true;
		id = lectureId;
	}

	const handleFileOpening = () => {
		goto($page.url + '/123');
	};
</script>

<div
	class="relative flex flex-col rounded-xl border bg-white shadow-sm dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-neutral-700/70"
>
	<!-- Cancel button -->
	{#if role === 'lecturer' && $selectForDelete}
		<Button
			color="red"
			class="absolute right-2 top-2  p-2"
			on:click={() => handleRemoveModalOpen(id)}
		>
			<CloseOutline />
		</Button>
	{/if}

	<img class="h-20 w-full rounded-t-xl" src="/images/pdf-icon.svg" alt="PDF preview" />
	<div class="p-4 md:p-5">
		<h3 class="text-lg font-bold text-gray-800 dark:text-white">
			{title}
		</h3>
		<p class="mt-1 text-gray-500 dark:text-neutral-400">
			{description}
		</p>
		<button
			type="button"
			class="mt-2 inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-green-600 px-3 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:pointer-events-none disabled:opacity-50"
			on:click={handleFileOpening}
		>
			Open PDF
		</button>
	</div>
</div>

<RemoveModal bind:open={isRemoveModalOpen} {id} item="material" />
