<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

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

<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/post" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create Announcement</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Label for="title" class="mb-2 mt-2 text-left">Title</Label>
		<Input type="text" id="title" name="title" placeholder="Fire Drill" size="md" required />

		<Label for="description" class="mb-2 mt-2 text-left">Description</Label>
		<Input
			type="text"
			id="description"
			name="description"
			placeholder="The fire drill is as follows..."
			size="md"
			required
		/>

		<Button type="submit" class="mt-4 w-full">Post</Button>
	</form>
</Modal>
