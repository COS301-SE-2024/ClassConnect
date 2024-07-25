<script lang="ts">
	import { Button, Modal } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { ExclamationCircleOutline } from 'flowbite-svelte-icons';
	import LocalFile from '$lib/components/modals/sandbox/LocalFile.svelte';
	import UploadedFile from '$lib/components/modals/sandbox/UploadedFile.svelte';

	export let open: boolean;
	export let items: any;

	let openLocalFileModal: boolean = false;
	let openLocalUploadedFileModal: boolean = false;
	const dispatch = createEventDispatcher();

	async function handleLocalFile(event: Event) {
		event.preventDefault();
		openLocalFileModal = true;
		open = false;
	}
	async function handleUploadedFile(event: Event) {
		event.preventDefault();
		openLocalUploadedFileModal = true;
		open = false;
	}
	function closeModal() {
		open = false;
		dispatch('close');
	}
</script>

<Modal id="deleteModal" bind:open size="md" placement="center" on:close={closeModal}>
	<div class="p-6 text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Where do want to get the 3D object?
		</h3>
		<div class="flex justify-center gap-4">
			<Button type="button" color="primary" on:click={handleLocalFile}>Local file</Button>
			<Button type="button" color="alternative" on:click={handleUploadedFile}>Uploaded File</Button>
		</div>
	</div>
</Modal>

<!-- Local File Modal -->
<LocalFile bind:open={openLocalFileModal} />

<!-- Uploaded File Modal -->
<UploadedFile bind:open={openLocalUploadedFileModal} {items} />
