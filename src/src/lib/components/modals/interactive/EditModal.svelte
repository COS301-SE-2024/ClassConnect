<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	export let id: string;
	export let title: string;
	export let description: string;
	export let instructions: string;
	export let open: boolean;

	let error: string;

	function close() {
		open = false;
		const toastId = toast.loading('Editing lesson...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Edited successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Edit Failed!: ' + error);
			}
		};
	}
</script>

<Toaster />

<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/editLesson" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Lesson</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} />

		<Label for="title" class="mb-2 mt-2 text-left">Title</Label>
		<Input type="text" id="title" name="title" placeholder={title} size="md" required />

		<Label for="description" class="mb-2 mt-2 text-left">Description</Label>
		<Textarea type="text" id="description" name="description" placeholder={description} size="md" />

		<Label for="description" class="mb-2 mt-2 text-left">Instructions</Label>
		<Textarea
			type="text"
			id="instructions"
			name="instructions"
			placeholder={instructions}
			size="md"
		/>

		<Button type="submit" class="mt-4 w-full">Save lesson</Button>
	</form>
</Modal>
