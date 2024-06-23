<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import IconEdit from '@tabler/icons-svelte/IconEdit.svelte';
	export let id;
	let formModal = false;

	// Function to handle form submission
	async function handleSubmit(event) {
		console.log('edit workspace is being handled');
		// Prevent the default form submission behavior
		event.preventDefault();

		const formData = new FormData(event.currentTarget);
		formData.append('work_id', id);
		
		const response = await fetch('/admin/workspaces?/edit', {
			method: 'POST',
			body: formData
		});

		console.log(response);

		formModal = false;
	}
</script>

<button
	on:click={() => (formModal = true)}
	class="transition-colors duration-200 hover:text-green-500 focus:outline-none dark:text-gray-300 dark:hover:text-green-500"
>
	<IconEdit stroke={2} />
</button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Workspace</h3>

		<Label for="work_name" class="mb-2 mt-2 space-y-2">Workspace Name</Label>
		<Input
			type="text"
			id="work_name"
			name="work_name"
			placeholder="Example University"
			size="md"
			required
		/>

		<Label for="upload_image" class="mb-2 mt-2 space-y-2">Upload image:</Label>
		<Input type="file" id="image" name="image" />

		<Button type="submit" class="w-full1">Edit Workspace</Button>
	</form>
</Modal>
