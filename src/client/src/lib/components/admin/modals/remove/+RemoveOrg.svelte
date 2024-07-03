<script>
	import { enhance } from '$app/forms';
	import { Button, Modal } from 'flowbite-svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';

	export let id;
	let popupModal = false;
</script>

<Button color="red" on:click={() => (popupModal = true)}>Remove</Button>

<Modal bind:open={popupModal} size="xs">
	<div class="text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this organisation?
		</h3>

		<form method="POST" action="?/delete" use:enhance>
			<input type="hidden" id="id" name="id" value={id} />

			<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
		</form>

		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>
