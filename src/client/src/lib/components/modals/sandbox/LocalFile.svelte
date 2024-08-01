<script lang="ts">
	import { Button, Modal, Label, Fileupload, Helper } from 'flowbite-svelte';
	import Preview from '$lib/components/modals/sandbox/Preview.svelte';
	import { displayedSandboxObjectURL } from '$src/lib/store/objects';
	import toast, { Toaster } from 'svelte-french-toast';

	export let open: boolean;

	let openPreviewModal: boolean = false;
	let fileSRC: string;

	async function handleFileUpload(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		const file = formData.get('file') as File;

		const extension = file.name.split('.').pop()?.toLowerCase();

		if (file) {
			if (!extension) {
				toast.error('File is not provided or has no extension!');
				throw new Error('File has no extension');
			}

			if(file.size > 100000000) {
				toast.error('The size of file should be less than 100 MB!');
				throw new Error('File is too big');
			}

			const objectsExtensions = ['gltf', 'glb'];
			console.log(objectsExtensions.includes(extension));
			if (objectsExtensions.includes(extension)) {
				const reader = new FileReader();
				reader.onload = (e) => {
					const url = e.target?.result as string;
					fileSRC = url;
					displayedSandboxObjectURL.set(fileSRC);
					openPreviewModal = true;
					open = false;
				};
				reader.readAsDataURL(file);
			} else {
				toast.error('Unsuppoted File Type!');
			}
		}
	}
</script>

<!-- Upload Modal -->
<Modal id="uploadModal" bind:open size="lg" placement="center">
	<Toaster />
	<form class="flex flex-col space-y-6" on:submit={handleFileUpload}>
		<Label for="with_helper" class="pb-2">Upload 3D object</Label>
		<Fileupload id="with_helper" name="file" class="mb-2" />
		<Helper>GLB or GLTF (MAX. 100 MB).</Helper>

		<Button type="submit" class="w-full">Upload 3D object</Button>
	</form>
</Modal>

<!-- Preview Modal -->
<Preview open={openPreviewModal} />
