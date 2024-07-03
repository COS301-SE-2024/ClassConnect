<script lang="ts">
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { TrashBinOutline } from 'flowbite-svelte-icons';
	import { Button, Modal } from 'flowbite-svelte';
	
	export let id = '';
	let popupModal = false;

	async function handleRemove(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		formData.append('userID', id);

		try {
			const response = await fetch('/admin/admins?/remove', {
				method: 'POST',
				body: formData
			});
			console.log(response)
		} catch (error) {
			console.error('Create User Error:', error);
		}

		popupModal = false;
	}
</script>

<button
	on:click={() => (popupModal = true)}
	class="transition-colors duration-200 hover:text-green-500 focus:outline-none dark:text-gray-300 dark:hover:text-green-500"
>
	<TrashBinOutline stroke={2} />
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
