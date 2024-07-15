<script lang="ts">
	import Card from '$src/lib/components/materials/Card.svelte';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import {Tabs ,TabItem, Button, Modal, Label, Input, Fileupload, TableSearch, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell} from 'flowbite-svelte'
	import { CirclePlusOutline, CloseCircleOutline, WandMagicSparklesOutline, ArrowUpFromBracketOutline, } from 'flowbite-svelte-icons';

	export let data;
	let { materials }: any = data;

	let formErrors = {
        title: '',
        description: '',
        file: ''
    };


	let uploadModal  = false;


let uploadedFileUrl = '';
let isValid = true;



const ALLOWED_EXTENSIONS = ['.glb','.gltf'];


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
			uploadModal = false;
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



</script>

<div class="p-4">
    <h1 class="text-2xl font-bold dark:text-white">Materials</h1>
    <div class="mt-2">
        <Tabs>
            <TabItem open>
                <span slot="title">All Materials</span>
                <div class="flex justify-between items-center mt-4">
                    <Button on:click={() => (uploadModal = true)} color='blue' class="flex items-center space-x-1">
                        <ArrowUpFromBracketOutline class="h-5 w-5" />
                        <span>Upload File</span>
                    </Button>
                </div>
                <!-- Modal Menu -->
				<Modal bind:open={uploadModal} size="xs" autoclose={false} class="w-full">
					<form class="flex flex-col space-y-6" on:submit={handleTempUpload} use:enhance={handleFormSubmit} method="POST" action="?/uploadMat" enctype="multipart/form-data">
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
                {#if materials && materials.length > 0}
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                        {#each materials as material}
                            <Card title={material.title} description={material.description} />
                        {/each}
                    </div>
                {:else}
                    <p class="mt-4 text-center text-gray-600 dark:text-white">There are no materials available</p>
                {/if}
            </TabItem>

            <TabItem open>
                <span slot="title">Documents</span>
                <div class="flex justify-between items-center mt-4">
                    <Button on:click={() => (uploadModal = true)} color='blue' class="flex items-center space-x-1">
                        <ArrowUpFromBracketOutline class="h-5 w-5" />
                        <span>Upload File</span>
                    </Button>
                </div>
                <!-- Modal Menu -->
				<Modal bind:open={uploadModal} size="xs" autoclose={false} class="w-full">
					<form class="flex flex-col space-y-6" on:submit={handleTempUpload} use:enhance={handleFormSubmit} method="POST" action="?/uploadMat" enctype="multipart/form-data">
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
                {#if materials && materials.length > 0}
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                        {#each materials as material}
                            <Card title={material.title} description={material.description} />
                        {/each}
                    </div>
                {:else}
                    <p class="mt-4 text-center text-gray-600 dark:text-white">There are no materials available</p>
                {/if}
            </TabItem>

            <TabItem open>
                <span slot="title">3D Materials</span>
                <div class="flex justify-between items-center mt-4">
                    <Button on:click={() => (uploadModal = true)} color='blue' class="flex items-center space-x-1">
                        <ArrowUpFromBracketOutline class="h-5 w-5" />
                        <span>Upload File</span>
                    </Button>
                </div>
                <!-- Modal Menu -->
				<Modal bind:open={uploadModal} size="xs" autoclose={false} class="w-full">
					<form class="flex flex-col space-y-6" on:submit={handleTempUpload} use:enhance={handleFormSubmit} method="POST" action="?/uploadMat" enctype="multipart/form-data">
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
                {#if materials && materials.length > 0}
                    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
                        {#each materials as material}
                            <Card title={material.title} description={material.description} />
                        {/each}
                    </div>
                {:else}
                    <p class="mt-4 text-center text-gray-600 dark:text-white">There are no materials available</p>
                {/if}
            </TabItem>
        </Tabs>
    </div>
</div>
