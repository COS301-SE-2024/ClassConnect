<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Textarea } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	export let open: boolean;

	let error: string;

	function close() {
		open = false;
		const toastId = toast.loading('Creating lesson...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Creation successful');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Creation Failed!: ' + error);
			}
		};
	}
</script>

<Toaster />

<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/createLesson" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">
			Create New Interactive Lesson
		</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Label for="title" class="mb-2 mt-2 text-left">Title</Label>
		<Input type="text" id="title" name="title" placeholder="Title" size="md" required />

		<Label for="description" class="mb-2 mt-2 text-left">Description</Label>
		<Textarea
			type="text"
			id="description"
			name="description"
			placeholder="Introduction to thermal dynamics"
			size="md"
			required
		/>

		<Label for="description" class="mb-2 mt-2 text-left">Instructions</Label>
		<Textarea
			type="text"
			id="instructions"
			name="instructions"
			placeholder="Instructions"
			size="md"
			required
		/>

		<Button type="submit" class="mt-4 w-full">Create lesson</Button>
	</form>
</Modal>
