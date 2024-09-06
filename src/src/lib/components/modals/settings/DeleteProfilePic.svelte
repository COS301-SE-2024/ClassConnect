<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { change } from '$lib/store';

	export let open: boolean;

	function close() {
		open = false;
		const toastId = toast.loading('Deleting profile picture...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				const log: string = 'change at timestamp: ' + new Date().toISOString();
				change.set(log);
				toast.dismiss(toastId);
				toast.success('Profile picture deleted successfully');
			} else {
				const error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Deletion failed: ' + error);
			}
		};
	}
</script>

<Toaster />

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
