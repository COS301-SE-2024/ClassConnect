<script lang="ts">
	import { Button, Modal, Gallery } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { change } from '$lib/store';

	export let open: boolean;
	export let image: File;
	export let imgSRC: string;
	export let imgALT: string;

	async function handleFinalUpload(event: Event) {
		const toastId = toast.loading('Uploading...');

		open = false;

		event.preventDefault();

		const formData = new FormData();

		formData.append('file', image);

		const response = await fetch('/settings?/upload_picture', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			toast.dismiss(toastId);
			toast.success('Profile picture updated successfully');
			const log: string = 'change at timestamp: ' + new Date().toISOString();
			change.set(log);
		} else {
			const result = await response.json();
			toast.dismiss(toastId);
			toast.error('Update failed: ' + result.error);
		}
	}
</script>

<Toaster />

<Modal id="previewModal" bind:open size="lg" placement="center">
	<div class="p-6 text-center">
		<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">
			Are you sure you want to upload this profile picture?
		</h3>
		<div class="flex justify-center">
			<Gallery class="gap-4 py-2">
				<img class="h-96 w-96 rounded-full" src={imgSRC} alt={imgALT} />
			</Gallery>
		</div>
		<div class="flex justify-center gap-4">
			<Button color="primary" on:click={handleFinalUpload}>Yes, upload it</Button>
			<Button color="alternative" on:click={() => (open = false)}>No, cancel</Button>
		</div>
	</div>
</Modal>
