<script lang="ts">
	import { Button, Modal, Label, Fileupload, Helper } from 'flowbite-svelte';
	import Preview from '$lib/components/modals/sandbox/Preview.svelte';
	import { displayedSandboxObjectURL } from '$src/lib/store/objects';

	export let open: boolean;

	let openPreviewModal: boolean = false;
	let objFile: File;
	let fileSRC: string;
	let fileALT: string;

	async function handleFileUpload(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		const file = formData.get('file') as File;

		if (file) {
			objFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				const url = e.target?.result as string;
				fileSRC = url;
				displayedSandboxObjectURL.set(fileSRC);
				fileALT = file.name;
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
		<Label for="with_helper" class="pb-2">Upload 3D object</Label>
		<Fileupload id="with_helper" name="file" class="mb-2" />
		<Helper>GLB or GLTF (MAX. 100 MB).</Helper>

		<Button type="submit" class="w-full">Upload 3D object</Button>
	</form>
</Modal>

<!-- Preview Modal -->
<Preview open={openPreviewModal} />