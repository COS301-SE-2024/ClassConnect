<script lang="ts">
	import { Button, Modal, Label, Fileupload, Helper } from 'flowbite-svelte';
	import Preview from '$lib/components/modals/settings/Preview.svelte';

	export let open: boolean;

	let openPreviewModal: boolean = false;
	let image: File;
	let imgSRC: string;
	let imgALT: string;

	async function handleFileUpload(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		const file = formData.get('file') as File;

		if (file) {
			image = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				const url = e.target?.result as string;
				imgSRC = url;
				imgALT = file.name;
				openPreviewModal = true;
				open = false;
			};
			reader.readAsDataURL(file);
		}
	}
</script>

<!-- Upload Modal -->
<Modal id="uploadModal" bind:open size="lg" placement="center">
	<form class="flex flex-col space-y-6" on:submit={handleFileUpload}>
		<Label for="with_helper" class="pb-2">Upload picture</Label>
		<Fileupload id="with_helper" name="file" class="mb-2" />
		<Helper>SVG, PNG or JPG (MAX. 1 MB).</Helper>

		<Button type="submit" class="w-full">Upload Picture</Button>
	</form>
</Modal>

<!-- Preview Modal -->
<Preview open={openPreviewModal} {image} {imgSRC} {imgALT} />
