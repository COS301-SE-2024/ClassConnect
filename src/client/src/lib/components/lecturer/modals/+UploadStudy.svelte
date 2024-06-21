<script>
	import { Button, Modal, Label, Input, Fileupload } from 'flowbite-svelte';
	let formModal = false;

	async function handleUpload(event) {
		event.preventDefault();
		console.log('Upload is being handled');

		const formData = new FormData(event.currentTarget);
		for (const [key, value] of formData.entries()) {
			console.log(key, value);
		}

		const response = await fetch('/lecturer/dashboard?/upload', {
			method: 'POST',
			body: formData
		});
		console.log(response);
		formModal = false;
	}
</script>

<Button on:click={() => (formModal = true)}>Upload</Button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleUpload}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Upload Student Material</h3>
		<Label class="space-y-2" for="title">
			<span>Title</span>
			<Input type="text" placeholder="title" size="md" id="title" name="title" />
		</Label>
		<Label class="space-y-2" for="description">
			<span>Description</span>
			<Input type="text" placeholder="description" size="lg" id="description" name="description" />
		</Label>
		<Label class="py-2" for="file">Upload File</Label>
		<Fileupload id="file" size="lg" name="file" />
		<Button type="submit" class="w-full1">Upload File</Button>
	</form>
</Modal>
