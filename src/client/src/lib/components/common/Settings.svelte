<script lang="ts">
	import { Heading, Button, Alert } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { change } from '$lib/store'
	import { UploadOutline, InfoCircleSolid } from 'flowbite-svelte-icons';
	import DeleteProfilePic from '$lib/components/modals/settings/DeleteProfilePic.svelte';
	import UploadPicture from '$lib/components/modals/settings/UploadPicture.svelte';
	import UpdateGeneralDetails from '$lib/components/forms/UpdateGeneralDetails.svelte';
	import UpdatePassword from '$lib/components/forms/UpdatePassword.svelte';

	export let user: any;

	let updateStatus: any = null;

	let openDeleteModal = false;
	let openFileHandlingModal = false;

	async function getUserData() {
		try {
			const formData = new FormData()
			const response = await fetch('/settings?/get_user_details', {
				method: 'POST',
				body: formData
			});
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			const data = await response.json();
			if(data.data){
				const input = data.data;
				const innerString = JSON.parse(input)[0];
				const user_data = JSON.parse(innerString);
				user = user_data.user
				console.log(user)
			}
		} catch (error) {
			console.error('There was a problem with your fetch operation:', error);
		}
	}

	onMount(()=>{
		getUserData()
	});

	$: {
		change.subscribe(() => {
			getUserData()
		});
	}

</script>

{#if updateStatus === 'failure'}
	<Alert color="red" dismissable>
		<InfoCircleSolid slot="icon" class="h-5 w-5" />
		Update has been unsuccessful. Please try again.
	</Alert>
{/if}

{#if updateStatus === 'success'}
	<Alert color="green" dismissable>
		<InfoCircleSolid slot="icon" class="h-5 w-5" />
		Update has been successful.
	</Alert>
{/if}

<div class="grid grid-cols-1 px-4 pt-6 dark:bg-gray-900 xl:grid-cols-3 xl:gap-4">
	<div class="col-span-full mb-4 xl:mb-2">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl">
			Settings
		</Heading>
	</div>
	<div class="col-span-10 items-center">
		<div
			class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
		>
			<div class="items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4">
				<img
					class="mb-4 h-28 w-28 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
					src={user.image}
					alt="profile"
				/>
				<div>
					<h3 class="mb-1 text-xl font-bold text-gray-900 dark:text-white">Profile picture</h3>
					<div class="mb-4 text-sm text-gray-500 dark:text-gray-400">
						JPG, WEBP or PNG. Max size of 1 MB
					</div>
					<div class="flex items-center space-x-4">
						<Button
							class="inline-flex items-center rounded-lg bg-primary-700 px-3 py-2 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
							on:click={() => {
								openFileHandlingModal = true;
							}}
						>
							<UploadOutline class="-ml-1 mr-2 h-4 w-4" />
							Upload picture
						</Button>
						<Button
							color="red"
							class="px-3 py-2 text-sm font-medium"
							on:click={() => {
								openDeleteModal = true;
							}}>Delete</Button
						>
					</div>
				</div>
			</div>
		</div>
		<UpdateGeneralDetails name={user.name} email={user.email} surname={user.surname}/>
		<UpdatePassword />
	</div>
</div>

<!-- Delete Modal -->
<DeleteProfilePic open={openDeleteModal} />

<!-- File Handling Modal -->
<UploadPicture open = {openFileHandlingModal}/>