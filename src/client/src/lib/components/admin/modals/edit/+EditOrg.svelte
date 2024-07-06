<script lang="ts">
	import { Banner, Button, Modal, Label, Input } from 'flowbite-svelte';
	import type { Org } from '$lib/store/types';
	import { BullhornSolid } from 'flowbite-svelte-icons';
	import { user, orgChange } from '$lib/store';

	let formModal = false;
	let showBanner = false;

	// Function to handle form submission
	async function handleSubmit(event: SubmitEvent) {
		console.log('update is being handled');
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		formData.append('orgID', $user.getOrganisation());

		try {
			const response = await fetch('/admin/organisation?/edit', {
				method: 'POST',
				body: formData
			});

			const res = await response.json();

			if (response.ok) {
				const stringifiedArray = res.data;
				const jsonArray = JSON.parse(stringifiedArray);
				const jsonString = jsonArray[0];
				const result = JSON.parse(jsonString);

				console.log(result);

				const org: Org = {
					id: result.id,
					org_name: result.org_name,
					image: result.image
				};

				$user.updateOrganisation(org);

				console.log('This is the user after the update: ', $user);

				// Close the form modal and show the banner
				formModal = false;
				showBanner = true;

				const time: string = Date.now().toString();

				const updateString: string = 'Organisation updated at ' + time;

				orgChange.set(updateString);
			} else {
				throw Error('Failed to update organisation');
			}
		} catch (error) {
			console.error('create org error:', error);
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
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Organisation</h3>

		<Label for="org_name" class="mb-2 mt-2 space-y-2">Organisation Name</Label>
		<Input
			type="text"
			id="org_name"
			name="org_name"
			placeholder="Organisation"
			size="md"
			required
		/>

		<Button type="submit" class="w-full1">Edit Organisation</Button>
	</form>
</Modal>

{#if showBanner}
	<Banner id="default-banner" position="absolute">
		<p class="flex items-center text-2xl font-normal text-green-600 dark:text-green-400">
			<span class="me-3 inline-flex rounded-full bg-green-200 p-1 dark:bg-green-600">
				<BullhornSolid class="h-3 w-3 text-green-600 dark:text-green-400" />
				<span class="sr-only">Information</span>
			</span>
			<span>Organisation details edited</span>
		</p>
	</Banner>
{/if}
