<script lang="ts">
	import { Button, Modal, Label, Fileupload, Helper, Input } from 'flowbite-svelte';
	import PreviewMaterial from '$lib/components/modals/materials/PreviewMaterial.svelte';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean;
	const dispatch = createEventDispatcher();

	let openPreviewModal: boolean = false;
	let inputFile: File;
	let fileUrl: string = '';
	let type: string;
	let title: string;
	let description: string;

	const objectsExtensions = ['gltf', 'glb'];
	const MaterialExtensions = ['pdf', 'jpg', 'png', 'jpeg'];

	function handleFileUpload(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const file = formData.get('file') as File;
		title = formData.get('title') as string;
		description = formData.get('description') as string;

		if (file) {
			const extension = file.name.split('.').pop()?.toLowerCase();

			if (!extension) {
				throw new Error('File has no extension');
			}

			if (objectsExtensions.includes(extension)) {
				type = 'object';
			} else if (MaterialExtensions.includes(extension)) {
				type = 'material';
			} else {
				throw new Error('File type not supported');
			}

			console.log(type);

			inputFile = file;
			const reader = new FileReader();

			reader.onload = (e) => {
				const url = e.target?.result as string;
				fileUrl = url;
				console.log(fileUrl);
				if (fileUrl) {
					open = false;
					openPreviewModal = true;
				} else {
					console.log('Failed to read file URL');
				}
			};

			reader.readAsDataURL(file);
		}
	}

	function closeModal() {
		open = false;
		dispatch('close');
		openPreviewModal = true;
	}
</script>

<!-- Upload Modal -->
<Modal id="uploadModal" bind:open size="lg" placement="center" on:close={closeModal}>
	<form class="flex flex-col space-y-6" on:submit={handleFileUpload}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Upload Student Material</h3>

		<Label class="space-y-2" for="title">
			<span>Title</span>
			<Input type="text" placeholder="title" size="md" id="title" name="title" />
		</Label>

		<Label class="space-y-2" for="description">
			<span>Description</span>
			<Input type="text" placeholder="description" size="lg" id="description" name="description" />
		</Label>

		<Label for="with_helper" class="pb-2">Upload material:</Label>
		<Fileupload
			id="with_helper"
			name="file"
			class="mb-2"
			accept=".pdf, .glb, .gtlf, .png, .jpg, .jpeg"
		/>
		<Helper>PDF, PNG, JPG, GLB or GTLF (MAX. 100 MB).</Helper>

		<Button type="submit" class="w-full1">Upload File</Button>
	</form>
</Modal>

<!-- Preview Modal -->
{#if openPreviewModal}
	<PreviewMaterial
		open={openPreviewModal}
		file={inputFile}
		url={fileUrl}
		{type}
		{title}
		{description}
		on:close={() => (openPreviewModal = false)}
	/>
{/if}
