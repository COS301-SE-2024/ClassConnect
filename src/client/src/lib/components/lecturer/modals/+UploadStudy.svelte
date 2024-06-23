<script lang="ts">
	import { materials } from '$lib/services/materials';
	import { materialsInfo } from '$lib/store';
	import { Button, Modal, Label, Input, Fileupload } from 'flowbite-svelte';
	let formModal = false;

	// Function to store the materialID in local storage
	function storeMaterialID(id: string): void {
		localStorage.setItem('materialID', id);
		console.log('materialID: ', id);
	}

	async function handleUpload(event: SubmitEvent) {

		console.log('Upload is being handled');

		//this prevents default submission
		event.preventDefault();
		

		const formData = new FormData(event.target as HTMLFormElement);
		const title= formData.get('title')?.toString() ?? '';
		console.log("Title is: ", title);
		const description= formData.get('description')?.toString() ?? '';
		console.log("Description is: ", description);
		const file_path= formData.get('file')?.toString() ?? '';
		console.log("File is: ", file_path);
		const userID = localStorage.getItem('userID') || 'non-existent' //this is under the assumption that userDI is in localStorage
		const workspaceID='12345678'; //this is set to change

		try{
			const response= await materials(true, workspaceID, userID, title, description, file_path);

			console.log('Response:', response);

			if (response) {
				storeMaterialID(response._id);
				materialsInfo.update(currentMaterials => [
					...currentMaterials,
					{ title, description, file_path }
				]);
			}
		}catch(error){
			console.error('Upload material failed', error);
		}	
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
