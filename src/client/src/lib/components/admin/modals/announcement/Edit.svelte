<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

    export let id: string;
	export let role: string;
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
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Announcement</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

        <Input type="hidden" id="id" name="id" value={id} size="md" readonly />
        
		<Label for="title" class="mb-2 mt-2 text-left">New Title</Label>
		<Input type="text" id="title" name="title" placeholder="Fire Drill" size="md" required />

		<Label for="description" class="mb-2 mt-2 text-left">New Description</Label>
		<Input type="text" id="description" name="description" placeholder="The fire drill is as follows..." size="md" required />


		<Button type="submit" class="mt-4 w-full">Save</Button>
	</form>
</Modal>
