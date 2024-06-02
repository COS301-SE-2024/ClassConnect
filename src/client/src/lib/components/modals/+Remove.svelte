<script lang="ts">
	export let adminID = '';

	import { Button, Modal } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import { deleteUser } from '../../../services/users';
	import Bin from '$lib/images/bin.svg';
	let popupModal = false;

	async function handleRemove(event: Event) {
		event.preventDefault();

		try {
			await deleteUser(adminID);
		} catch (error) {
			console.error('Create User Error:', error);
		}

		popupModal = false;
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
