<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Input } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

	export let id: string;
	export let open: boolean;

	let error: string;

	function close() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				open = false;
			} else {
				error = result.data?.error;
			}
		};
	}
</script>

<Modal bind:open size="xs" class="text-center">
	<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		Are you sure you want to cancel this lesson?
	</h3>

	{#if error}
		<p class="mt-2 text-center text-red-500">{error}</p>
	{/if}

	<form method="POST" action="?/delete" use:enhance={close}>
		<Input type="hidden" id="id" name="id" value={id} />
		<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
	</form>
</Modal>
