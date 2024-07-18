<script lang="ts">
	import Card from '$lib/components/common/materials/Card.svelte';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import {Tabs ,TabItem, Button,Spinner, Modal, Label, Input, Fileupload,Checkbox, MultiSelect, Table,TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch} from 'flowbite-svelte'
	import {  ArrowUpFromBracketOutline,CircleMinusOutline } from 'flowbite-svelte-icons';

	export let data:any;
	let materialSearchTerm = '';
	let renderedMaterials : any[] = [];

	let formErrors = {
        title: '',
        description: '',
        file: ''
    };

	$:({role,materials}= data)

	$: {
		materials = materials.map((material: any) => ({
			...material,
	
		}));
		renderedMaterials = materials;
	}

	$: filteredItems = materials.filter((material:any) => material.title.toLowerCase().indexOf(materialSearchTerm.toLowerCase()) !== -1);


	let uploadModal  = false;
	let deleteModal  = false;


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
                <div class="flex justify-end items-center mt-4 space-x-2">
					<Button on:click={() => (deleteModal = true)} color='red' class="flex items-center space-x-1">
                        <CircleMinusOutline class="h-5 w-5" />
                        <span>Delete Files</span>
                    </Button>
                    <Button on:click={() => (uploadModal = true)} color='blue' class="flex items-center space-x-1">
                        <ArrowUpFromBracketOutline class="h-5 w-5" />
                        <span>Upload File</span>
                    </Button>
                </div>
				<!-- Modal Menu -->
				<Modal bind:open={deleteModal} size="xs" autoclose={false} class="w-full">
					<form method="POST" action="?/deleteMat">
						<TableSearch class="my-2" placeholder='Pick a 3D Object' hoverable={true} bind:inputValue={materialSearchTerm}>
							<TableHead>
								<TableHeadCell>Object</TableHeadCell>
								<TableHeadCell>Description</TableHeadCell>
								<TableHeadCell>Select</TableHeadCell>
							</TableHead>
							
							<TableBody tableBodyClass="divide-y">
								{#each filteredItems as item}
									<TableBodyRow>
										<TableBodyCell>{item.title}</TableBodyCell>
										<TableBodyCell>{item.description}</TableBodyCell>
										<TableBodyCell>
											<Checkbox name="selectedObjects" value={item.id} />
										</TableBodyCell>
									</TableBodyRow>
								{/each}
							</TableBody>
						</TableSearch>
						
						<div class="flex justify-end space-x-2 mt-4 ">
							<Button type="submit" on:click={() => (deleteModal = false)}>Submit</Button>
							<Button type="button" color="alternative" on:click={() => (deleteModal = false)}>
								Cancel
							</Button>
						</div>
					</form>
				</Modal>
                <!-- Modal Menu -->
				<Modal bind:open={uploadModal} size="xs" autoclose={false} class="w-full">
					<form class="flex flex-col space-y-6" method="POST" use:enhance action="?/uploadMat" enctype="multipart/form-data">
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
				{#await Promise.all(renderedMaterials)}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
					{#each renderedMaterials as _, index (index)}
						<div class="border rounded-lg p-4 flex justify-center items-center h-40">
							<Spinner size="8" />
						</div>
					{/each}
				</div>
			{:then _}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
					{#each renderedMaterials as materials (materials.id)}
						<Card title={materials.title} description={materials.description} />
					{/each}
				</div>
			{:catch error}
				<p class="mt-4 text-center text-red-600 dark:text-red-400">Error loading materials: {error.message}</p>
			{/await}
            </TabItem>

            <TabItem >
                <span slot="title">Documents</span>
                <div class="flex justify-end items-center mt-4 space-x-2">
					<Button on:click={() => (deleteModal = true)} color='red' class="flex items-center space-x-1">
                        <CircleMinusOutline class="h-5 w-5" />
                        <span>Delete Files</span>
                    </Button>
                    <Button on:click={() => (uploadModal = true)} color='blue' class="flex items-center space-x-1">
                        <ArrowUpFromBracketOutline class="h-5 w-5" />
                        <span>Upload File</span>
                    </Button>
                </div>
                <!-- Modal Menu -->
			
				<Modal bind:open={uploadModal} size="xs" autoclose={false} class="w-full">
					<form class="flex flex-col space-y-6"  method="POST" use:enhance action="?/uploadMat" enctype="multipart/form-data">
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
				{#await Promise.all(renderedMaterials)}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
					{#each renderedMaterials as _, index (index)}
						<div class="border rounded-lg p-4 flex justify-center items-center h-40">
							<Spinner size="8" />
						</div>
					{/each}
				</div>
			{:then _}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
					{#each renderedMaterials as materials (materials.id)}
						<Card title={materials.title} description={materials.description} />
					{/each}
				</div>
			{:catch error}
				<p class="mt-4 text-center text-red-600 dark:text-red-400">Error loading materials: {error.message}</p>
			{/await}
            </TabItem>

            <TabItem >
                <span slot="title">3D Materials</span>
                <div class="flex justify-end items-center mt-4 space-x-2">
					<Button on:click={() => (deleteModal = true)} color='red' class="flex items-center space-x-1">
						<CircleMinusOutline class="h-5 w-5" />
						<span>Delete Files</span>
					</Button>	
                    <Button on:click={() => (uploadModal = true)} color='blue' class="flex items-center space-x-1">
                        <ArrowUpFromBracketOutline class="h-5 w-5" />
                        <span>Upload File</span> 
                    </Button>
                </div>
                <!-- Modal Menu -->
				<Modal bind:open={uploadModal} size="xs" autoclose={false} class="w-full">
					<form class="flex flex-col space-y-6"  method="POST" use:enhance action="?/uploadMat" enctype="multipart/form-data">
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
				{#await Promise.all(renderedMaterials)}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
					{#each renderedMaterials as _, index (index)}
						<div class="border rounded-lg p-4 flex justify-center items-center h-40">
							<Spinner size="8" />
						</div>
					{/each}
				</div>
			{:then _}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-4">
					{#each renderedMaterials as materials (materials.id)}
						<Card title={materials.title} description={materials.description} />
					{/each}
				</div>
			{:catch error}
				<p class="mt-4 text-center text-red-600 dark:text-red-400">Error loading materials: {error.message}</p>
			{/await}
            </TabItem>
        </Tabs>
    </div>
</div>
