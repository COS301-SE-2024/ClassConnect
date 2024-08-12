<script lang="ts">
	import { enhance } from '$app/forms';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';
	import { Button, Modal, Input } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { mat_change } from '$lib/store/';
	import { page } from '$app/stores';

	const dispatch = createEventDispatcher();

	export let id: string;
	export let open: boolean;
	export let name: string;

	async function close() {
		open = false;
		const toastId = toast.loading('Deleting...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Delete was successfully!');
				mat_change.set('Material deleted at: ' + Date.now().toString());
				document.getElementById('reload_btn_delete')?.click();
			} else {
				toast.dismiss(toastId);
				toast.error('Delete Failed!');
			}
		};
	}

	function closeModal() {
		console.log('Delete Material: This is the id and name passed in: ', name, id);
		open = false;
		dispatch('close');
	}
</script>

<Toaster />

<a id="reload_btn_delete" href={$page.url.pathname} data-sveltekit-reload class="hidden">
	<button>Reload</button>
</a>

<Modal bind:open size="xs" class="text-center">
	<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		Are you sure you want to remove {name} ?
	</h3>

	<form method="POST" action="?/deleteMat" use:enhance={close} on:close={closeModal}>
		<Input type="hidden" id="id" name="id" value={id} />

		<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
	</form>
</Modal>
