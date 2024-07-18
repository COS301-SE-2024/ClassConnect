<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Banner } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

	export let open: boolean;

	let message: string;
	let color: string;
	let display: boolean = false;

	function close() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				message = 'Deleted profile picture successfully';
				color = 'green';
				open = false;
				display = true;
			} else {
				console.error(result.data?.error);
				message = 'Delete failed';
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

<!-- Delete Modal -->
<Modal id="deleteModal" bind:open size="md" placement="center">
	<form
		method="POST"
		action="/settings?/delete_picture"
		use:enhance={close}
		class="p-6 text-center"
	>
		<ExclamationCircleOutline class="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this profile picture?
		</h3>
		<div class="flex justify-center gap-4">
			<Button type="submit" color="red">Yes, delete it</Button>
			<Button type="button" on:click={() => (open = false)}>No, cancel</Button>
		</div>
	</form>
</Modal>
