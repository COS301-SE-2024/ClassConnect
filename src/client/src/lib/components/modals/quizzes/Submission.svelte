<script lang="ts">
	import { Modal, Button } from 'flowbite-svelte';

	export let open: boolean = false;
	export let submissionMessage: string = '';
	export let totalPoints: number = 0;

	let error: string;

	async function close() {
		try {
			await new Promise((resolve) => setTimeout(resolve, 500));

			open = false;
		} catch (err) {
			error = 'An error occurred while closing the modal.';
			console.error(err);
		}
	}
</script>

<Modal bind:open size="xs" class="w-full">
	<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Quiz Submission</h3>
	{#if error}
		<p class="mt-2 text-center text-red-500">{error}</p>
	{/if}
	<p class="mb-4 text-base font-normal text-gray-700 dark:text-gray-400">
		{submissionMessage}
	</p>
	<p class="mb-4 text-lg font-semibold">
		Total Points: {totalPoints}
	</p>
	<Button class="mt-4 w-full" on:click={close}>Close</Button>
</Modal>
