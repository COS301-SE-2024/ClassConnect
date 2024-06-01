<script>
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import { organisationName } from '$lib/stores/store';
	let formModal = false;

	// Function to handle form submission
	async function handleSubmit(event) {
		console.log('edit is being handled');
		// Prevent the default form submission behavior
		event.preventDefault();

		// Create a FormData object from the form
		const formData = new FormData(event.target);
		const orgID = localStorage.getItem('organisationID') || 'non-existent';
		formData.append('orgID', orgID);

		// Send a request to your server-side action
		const response = await fetch('/organisation?/edit', {
			method: 'POST',
			body: formData
		});

		// If the request was successful, store the access token in local storage
		if (response.ok) {
			const res = await response.json();
			const dataString = JSON.parse(res.data); // This will parse the outer array
			const dataObject = JSON.parse(dataString[0]); // This will parse the inner object
			console.log(dataObject.body.newOrgName);
			organisationName.set(dataObject.body.newOrgName);
		}
	}
</script>

<Button on:click={() => (formModal = true)}>
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
	<span class="px-2">Edit Organisation</span>
</Button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Your Profile</h3>

		<Label for="org_name" class="mb-2 mt-2 space-y-2">Organisation Name</Label>
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

		<Button type="submit" class="w-full1">Edit Account</Button>
	</form>
</Modal>
