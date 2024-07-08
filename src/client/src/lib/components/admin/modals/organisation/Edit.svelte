<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	export let id: string;
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
	<form method="POST" action="?/edit" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Organisation</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} readonly />

		<Label for="name" class="mb-2 mt-2 text-left">New Name</Label>
		<Input type="text" id="name" name="name" placeholder="Example University" size="md" />

		<Label for="image" class="mb-2 mt-4 text-left">New Logo</Label>
		<Input
			type="text"
			id="image"
			name="image"
			size="md"
			placeholder="https://example.com/logo.png"
		/>

		<Button type="submit" class="mt-4 w-full">Save</Button>
	</form>
</Modal>
