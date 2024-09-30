<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	export let id: string;
	export let open: boolean;

	let error: string;

	function close() {
		const toastId = toast.loading('Adding announcement...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Announcement added successfully');
				open = false;
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Addition failed: ' + error);
				open = false;
			}
		};
	}
</script>

<Toaster />

<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/post" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create Announcement</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" name="createdBy" value={id} />

		<Label for="title" class="mb-2 mt-2 text-left">Title</Label>
		<Input type="text" id="title" name="title" placeholder="Fire Drill" size="md" required />

		<Label for="content" class="mb-2 mt-2 text-left">Content</Label>
		<Textarea
			type="text"
			id="content"
			name="content"
			placeholder="The fire drill is as follows..."
			size="md"
			required
		/>

		<Button type="submit" class="mt-4 w-full">Post</Button>
	</form>
</Modal>
