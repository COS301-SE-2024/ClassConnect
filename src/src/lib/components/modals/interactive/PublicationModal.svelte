<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Input } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import toast, { Toaster } from 'svelte-french-toast';

	export let id: string;
	export let publication: string;
	export let open: boolean;

	let error: string;

	function close() {
		open = false;
		const toastId = toast.loading('Making lesson public...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Successfully made lesson public');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Publication Failed!: ' + error);
			}
		};
	}
</script>

<Toaster />

<Modal bind:open size="xs" class="text-center">
	<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		Are you sure you want to make this lesson {publication}?
	</h3>

	{#if error}
		<p class="mt-2 text-center text-red-500">{error}</p>
	{/if}

	<form method="POST" action="?/togglePublicaction" use:enhance={close}>
		<Input type="hidden" id="id" name="id" value={id} />
		<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
	</form>
</Modal>
