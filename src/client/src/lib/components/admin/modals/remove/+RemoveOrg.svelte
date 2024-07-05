<script lang="ts">
	import { Banner, Button, Modal } from 'flowbite-svelte';
	import { ExclamationCircleOutline, BullhornSolid } from 'flowbite-svelte-icons';
	import type { Org } from '$lib/store/types';
	import { user, orgChange } from '$lib/store';

	let popupModal = false;
	let showBanner = false;

	async function handleRemove() {
		console.log('remove is being handled');

		// Create a FormData object
		const formData = new FormData();
		formData.append('organisationID', $user.getOrganisation());

		try {
			const response = await fetch('/admin/organisation?/remove', {
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

				// Close the form modal and show the banner
				popupModal = false;
				showBanner = true;

				const time: string = Date.now().toString();

				const updateString: string = 'Organisation updated at ' + time;

				orgChange.set(updateString);
			} else {
				throw Error('Failed to remove organisation');
			}
		} catch (error) {
			console.error('remove org error:', error);
		}

		popupModal = false;
	}
</script>

<Button on:click={() => (popupModal = true)}>Remove</Button>

<Modal bind:open={popupModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this organisation?
		</h3>
		<Button color="red" class="me-2" on:click={handleRemove}>Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>

{#if showBanner}
	<Banner id="default-banner" position="absolute">
		<p class="flex items-center text-2xl font-normal text-red-600 dark:text-red-400">
			<span class="me-3 inline-flex rounded-full bg-red-200 p-1 dark:bg-red-600">
				<BullhornSolid class="h-3 w-3 text-red-600 dark:text-red-400" />
				<span class="sr-only">Warning</span>
			</span>
			<span> Organisation deleted successfully </span>
		</p>
	</Banner>
{/if}
