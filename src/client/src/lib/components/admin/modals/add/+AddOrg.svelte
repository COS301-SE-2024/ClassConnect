<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import { user } from '$lib/store';
	import type { Org } from '$lib/store/types'

	let formModal = false;

	// Function to handle form submission
	async function handleSubmit(event: SubmitEvent) {
		console.log('add is being handled');
		// Prevent the default form submission behavior
		event.preventDefault();

		// Create a FormData object from the form
		const formData = new FormData(event.target as HTMLFormElement);
		formData.append('orgID', $user.getOrganisation());
		formData.append('userID', $user.getUserID());
		
		const name = formData.get('org_name')?.toString() ?? '';
		const userID = formData.get('userID')?.toString() ?? '';

		console.log('This is the name parameter:', name);
		console.log('This is the userID parameter:', userID);

		try {
			const response = await fetch('/admin/organisation?/create', {
				method: 'POST',
				body: formData
			});

			const res = await response.json();

			if(response.ok) {
				const stringifiedArray = res.data
				const jsonArray = JSON.parse(stringifiedArray);
				const jsonString = jsonArray[0];
				const result = JSON.parse(jsonString);

				console.log(result)

				const org : Org = {
					id: result.id,
					org_name: result.org_name,
					image: result.image
				}

				$user.updateOrganisation(org);

			}else{
				throw(Error('Failed to create organisation'));
			}

		} catch (error) {
			console.error('create org  error:', error);
		}

		formModal = false;
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

		<Button type="submit" class="w-full1">Create Organisation</Button>
	</form>
</Modal>
