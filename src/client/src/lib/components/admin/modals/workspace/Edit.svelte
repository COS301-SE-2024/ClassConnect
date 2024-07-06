<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Select } from 'flowbite-svelte';

	export let id: string;
	export let open: boolean;
	export let lecturers: [{ id: string; name: string }];

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
	<form method="POST" action="?/edit" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Workspace</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} />

		<Label for="name" class="mb-2 mt-2 text-left">Name</Label>
		<Input
			type="text"
			id="name"
			name="name"
			placeholder="Object Orientated Programming"
			size="md"
		/>

		<Label for="description" class="mb-2 mt-2 text-left">Description</Label>
		<Input
			type="text"
			id="description"
			name="description"
			placeholder="Introduction to OOP"
			size="md"
		/>

		<Label for="owner" class="mb-2 mt-4 text-left">Owner</Label>
		<Select id="owner" name="owner">
			{#each lecturers as lecturer}
				<option value={lecturer.id}>{lecturer.name}</option>
			{/each}
		</Select>

		<Label for="image" class="mb-2 mt-4 text-left">Display Image</Label>
		<Input
			type="text"
			id="image"
			name="image"
			size="md"
			placeholder="https://example.com/image.png"
		/>

		<Button type="submit" class="mt-4 w-full">Save</Button>
	</form>
</Modal>
