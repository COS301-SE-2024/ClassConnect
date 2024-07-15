<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/envirmonment/+Scene.svelte';
	import ObjectSettings from '$lib/components/envirmonment/models/+ObjectSettings.svelte';
	import { Button, Modal, Label, Input, Fileupload, Radio ,Range,  Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';
	import { CirclePlusOutline, CloseCircleOutline, WandMagicSparklesOutline, ArrowUpFromBracketOutline, } from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';
	import {items} from "./items"
	import type { ActionResult } from '@sveltejs/kit';
	import { displayedSandboxObjectURL } from '$src/lib/store/objects';

	

	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let enableZoom: boolean = true;
	let sizeRange = 1;

	let experimentModal = false;
	let uploadModal  = false;

    let formErrors = {
        title: '',
        description: '',
        file: ''
    };
    let uploadedFileUrl = '';
	let isValid = true;

	function handleObjectSelect(items:any) {
		displayedSandboxObjectURL.set(items.fileURL);
		experimentModal = false;
		
	}

	const ALLOWED_EXTENSIONS = ['.glb','.gltf'];

function validateForm(formData: FormData) {

	const file = formData.get('file') as File;

	if (!file || file.size === 0) {
		formErrors.file = 'Please select a file to upload';
		isValid = false;
	} else {
		const fileName = file.name.toLowerCase();
		const fileExtension = '.' + fileName.split('.').pop();
		if (!ALLOWED_EXTENSIONS.includes(fileExtension)) {
			formErrors.file = `Invalid file type. Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`;
			isValid = false;
		}
	}

	return isValid;
}

	function handleTempUpload(event:any) {
		const form  = event.target as HTMLFormElement;
		const formData = new FormData(form);
		

        if (!validateForm(formData)) {
            event.preventDefault();
		}
	}
		function handleFormSubmit() {
    return async ({ result }: { result: ActionResult }) => {
        if (result.type === 'success') {
            const data = result.data as { success: boolean; fileUrl?: string; error?: string };
            if (data.success && data.fileUrl) {
                uploadedFileUrl = data.fileUrl;
                console.log('Uploaded file URL:', uploadedFileUrl);
                experimentModal = false;
            } else {
                // Handle error
                console.error('Upload failed:', data.error);
            }
        } else if (result.type === 'failure') {
            console.error('Form submission failed');
        } else {
            console.log('Unexpected result type:', result.type);
        }
    };
}

</script>

<main class="p-4">
	<div class="flex flex-col space-y-4">
		<header class="flex items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
			<h1 class="text-2xl font-semibold dark:text-gray-200">Sandbox</h1>
			<div class="flex space-x-2">

				<Button on:click={() => (uploadModal = true)} color='blue' class="flex items-center  space-x-1">
					<ArrowUpFromBracketOutline class="h-5 w-5" />
					<span>Upload File</span>
				</Button>
				<!-- Modal Menu -->
				<Modal bind:open={uploadModal} size="xs" autoclose={false} class="w-full">
					<form class="flex flex-col space-y-6" on:submit={handleTempUpload} use:enhance={handleFormSubmit} method="POST" action="?/uploadMat" enctype="multipart/form-data" >
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



				<Button on:click={() => (experimentModal = true)} color='green' class="flex items-center  space-x-1">
					<CirclePlusOutline class="h-5 w-5" />
					<span>Add To Scene</span>
				</Button>
				<!-- Modal Menu -->
				<Modal bind:open={experimentModal} size="xs" autoclose={false} class="w-full">


		
	<Table class="my-2" hoverable={true}>
		<TableHead>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Object</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>

		</TableHead>

		<TableBody tableBodyClass="divide-y">
			{#each items as item}
			<TableBodyRow on:click={() => handleObjectSelect(item)} class="cursor-pointer">

					<TableBodyCell>{item.id}</TableBodyCell>

					<TableBodyCell>{item.title}</TableBodyCell>

					<TableBodyCell>{item.description}</TableBodyCell>

				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>

				</Modal>

				<Button color="red" class="flex items-center space-x-1">
					<CloseCircleOutline class="h-5 w-5" />
					<span>Remove From Scene</span>
				</Button>
			</div>
		</header>
		<section
			class="flex h-[700px] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
		>
			<div class="flex-1">
				<Canvas>
					<Scene
						{enableDamping}
						{autoRotate}
						{rotateSpeed}
						{zoomToCursor}
						{zoomSpeed}
						{enableZoom}
					/>
				</Canvas>
			</div>
			<ObjectSettings
				bind:enableDamping
				bind:autoRotate
				bind:rotateSpeed
				bind:zoomToCursor
				bind:zoomSpeed
				bind:enableZoom
			/>
		</section>
	</div>
</main>