<script lang="ts">
	import { enhance } from '$app/forms';
	import Banner from '$lib/components/common/Banner.svelte';
	import { Button, Modal, Input } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

	export let id: string;
	export let open: boolean;

	let error: string;
	let message: string;
	let color: string;
	let display: boolean = false;

	function close() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				message = 'Deleted successfully';
				color = 'green';
				open = false;
				display = true;
			} else {
				error = result.data?.error;
				message = 'Delete failed: ' + error;
				color = 'red';
				open = false;
				display = true;
			}
		};
	}
</script>

{#if display}
	<Banner type="Delete" {color} {message} />
{/if}

<Modal bind:open size="xs" class="text-center">
	<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		Are you sure you want to remove this item?
	</h3>

	<form method="POST" action="" use:enhance={close}>
		<Input type="hidden" id="id" name="id" value={id} />

		<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
	</form>
</Modal>