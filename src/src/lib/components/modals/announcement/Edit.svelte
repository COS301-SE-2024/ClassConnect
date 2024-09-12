<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	export let id: string;
	export let open: boolean;

	let error: string;

	function close() {
		const toastId = toast.loading('Editing announcement...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Announcement updated successfully');
				open = false;
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Update failed: ' + error);
			}
		};
	}
</script>

<Toaster />

<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/edit" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Announcement</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} size="md" readonly />

		<Label for="title" class="mb-2 mt-2 text-left">New Title</Label>
		<Input type="text" id="title" name="title" placeholder="Fire Drill" size="md" />

		<Label for="content" class="mb-2 mt-2 text-left">New Content</Label>
		<Input
			type="text"
			id="content"
			name="content"
			placeholder="The fire drill is as follows..."
			size="md"
		/>

		<Button type="submit" class="mt-4 w-full">Save</Button>
	</form>
</Modal>
