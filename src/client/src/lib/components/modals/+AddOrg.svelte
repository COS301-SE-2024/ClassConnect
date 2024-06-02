<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import { organisationName } from '$lib/stores/store';
	import { organizations } from '../../../services/orgs';
	
	import { goto } from '$app/navigation';
	//import { organizations } from '../../../services/orgs'
	let formModal = false;

	// async function updateOrgName() {
	// 	const formData = new URLSearchParams();
	// 	const orgID = localStorage.getItem('organisationID') || 'non-existent';
	// 	formData.append('organisationID', orgID);

	// 	const response = await fetch('/organisation?/getOrganisationDetails', {
	// 		method: 'POST',
	// 		headers: {
	// 			'Content-Type': 'application/x-www-form-urlencoded'
	// 		},
	// 		body: formData
	// 	});

	// 	if (response.ok) {
	// 		const res = await response.json();
	// 		const dataString = JSON.parse(res.data); // This will parse the outer array
	// 		const dataObject = JSON.parse(dataString[0]); // This will parse the inner object
	// 		organisationName.set(dataObject.body.organisationName);
	// 	}
	// }

	// Function to store the access token in local storage
	function storeOrgID(id: string) :void {
		localStorage.setItem('organisationID', id);
		console.log('organasation ID', id);
	}

	// Function to handle form submission
	async function handleSubmit(event: SubmitEvent) {
		console.log('add is being handled');
		// Prevent the default form submission behavior
		event.preventDefault();

		// Create a FormData object from the form
		const formData = new FormData(event.target as HTMLFormElement);
		const name = formData.get('org_name')?.toString() ?? '';
		console.log("This is the name parameter:", name )
		const userID = localStorage.getItem('userID') || 'non-existent';
		const image = 'https://www.edarabia.com/wp-content/uploads/2013/08/university-of-pretoria-logo-south-africa.jpg';
		//console.log("User ID Add Org:", userID);
		try {
			const response = await organizations(name,  userID, image);

			console.log('Response:', response);

			if (response ) {
				
				storeOrgID( response._id);
				organisationName.set(response.name);
				
			}
		} catch (error) {
			console.error('create org  error:', error);
			alert('Create failed');
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
	<span class="px-2">Create Organisation</span>
</Button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create New Organisation</h3>

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

		<Button type="submit" class="w-full1">Create Organisation</Button>
	</form>
</Modal>
