<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	let formModal = false;

	// Function to handle form submission
	async function handleSubmit(event) {
		console.log('add workspace is being handled');
		// Prevent the default form submission behavior
		event.preventDefault();

		const formData = new FormData(event.currentTarget);

		const organisationId = localStorage.getItem('organisationID') || 'non-existent';
		const createdBy = localStorage.getItem('userID') || 'non-existent';

		if (organisationId !== 'non-existent') {
			formData.append('organisationId', organisationId);
			formData.append('createdBy', createdBy);
			const response = await fetch('/admin/workspaces?/add', {
				method: 'POST',
				body: formData
			});
			console.log(response);
			formModal = false;
		} else {
			const errorMessage = 'You need to be part of an organisation to create a workspace';
			alert(errorMessage);
		}
	}
</script>

<Button on:click={() => (formModal = true)} class="mx-2">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="h-5 w-5"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
	<span class="px-2">Add Workspace</span>
</Button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create New Workspace</h3>

		<Label for="org_name" class="mb-2 mt-2 space-y-2">Workspace Name</Label>
		<Input
			type="text"
			id="org_name"
			name="org_name"
			placeholder="Example University"
			size="md"
			required
		/>

		<Label for="upload_image" class="mb-2 mt-2 space-y-2">Upload image:</Label>
		<Input type="file" id="image" name="image" />

		<Button type="submit" class="w-full1">Create Workspace</Button>
	</form>
</Modal>
