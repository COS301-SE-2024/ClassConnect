<script>
	import { Button, Modal, Label, Input, Fileupload } from 'flowbite-svelte';
	let formModal = false;

	async function handleUpload() {
		const formData = new URLSearchParams();
		const response = await fetch('/lecturer/dashboard?/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: formData
		});
		formModal = false
	}
</script>

<Button on:click={() => (formModal = true)}>Upload</Button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit|preventDefault={handleUpload}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Upload Student Material</h3>
		<Label class="space-y-2">
			<span>Title</span>
			<Input type="text" placeholder="title" size="md" />
		</Label>
		<Label class="space-y-2">
			<span>Description</span>
			<Input type="text" placeholder="description" size="lg" />
		</Label>
		<Label class="py-2" for="larg_size">Upload File</Label>
		<Fileupload id="larg_size" size="lg" />
		<Button type="submit" class="w-full1">Upload File</Button>
	</form>
</Modal>
