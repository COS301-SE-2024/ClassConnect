<script>
	import { goto } from '$app/navigation';
	import { Button, Modal } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import Bin from '$lib/images/bin.svg';
	let popupModal = false;

	async function handleRemove() {
		const formData = new URLSearchParams();
		const orgID = localStorage.getItem('organisationID') || 'non-existent';
		formData.append('organisationID', orgID);

		const response = await fetch('/organisation?/remove', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formData
		});

		if (response.ok) {
			goto('/signup');
		}
	}
</script>

<button
	on:click={() => (popupModal = true)}
	class="text-gray-500 transition-colors duration-200 hover:text-green-500 focus:outline-none dark:text-gray-300 dark:hover:text-green-500"
>
	<img src={Bin} alt="Bin" class="mx-2 h-5 w-5" />
</button>

<Modal bind:open={popupModal} size="xs" autoclose>
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this user?
		</h3>
		<Button color="red" class="me-2" on:click={handleRemove}>Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>
