<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import Banner from '$lib/components/common/Banner.svelte';
	export let id: string;
	export let open: boolean;

	let error: string;
	let message: string;
	let color: string
	let display: boolean = false;

	function close() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				message = 'Announcement updated successfully';
				color = 'green';
				open = false;
				display = true;
			} else {
				message = 'Announcement update failed';
				color = 'red';
				error = result.data?.error;
				display = true;
			}
		};
	}
</script>

{#if display}
	<Banner type="Update" color={color} message={message} />
{/if}

<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/edit" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Announcement</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} size="md" readonly />

		<Label for="title" class="mb-2 mt-2 text-left">New Title</Label>
		<Input type="text" id="title" name="title" placeholder="Fire Drill" size="md" />

		<Label for="description" class="mb-2 mt-2 text-left">New Description</Label>
		<Input
			type="text"
			id="description"
			name="description"
			placeholder="The fire drill is as follows..."
			size="md"
		/>

		<Button type="submit" class="mt-4 w-full">Save</Button>
	</form>
</Modal>
