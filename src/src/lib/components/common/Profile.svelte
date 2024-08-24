<script lang="ts">
	import { Button, Modal, Gallery, ImagePlaceholder } from 'flowbite-svelte';
	import DeleteProfilePic from '$lib/components/modals/settings/DeleteProfilePic.svelte';
	import UploadPicture from '$lib/components/modals/settings/UploadPicture.svelte';
	import Settings from '$lib/components/common/ProfileSettings.svelte';
	import { change } from '$lib/store';
	import axios from 'axios';
	import { onMount } from 'svelte';
	export let user: any;

	let openEditProfile = false;
	let openDeleteModal = false;
	let openFileHandlingModal = false;
	let update = false;
	let loading = true;

	const apiUrl = '/api/user';

	async function getUserData() {
		loading = true;
		try {
			axios
				.get(apiUrl)
				.then((response) => {
					console.log('User data:', response.data);
					user = response.data;
					loading = false;
				})
				.catch((error) => {
					if (error.response) {
						console.error('Error response data:', error.response.data);
						console.error('Error response status:', error.response.status);
					} else if (error.request) {
						console.error('Error request:', error.request);
					} else {
						console.error('Error message:', error.message);
					}
					loading = false;
				});
		} catch (error) {
			console.error('There was a problem with the get operation:', error);
		}
	}

	onMount(async () => {
		await getUserData();
		loading = false;
	});

	$: {
		change.subscribe(() => {
			getUserData();
		});
	}
	
</script>

<div class="ease-soft-in-out xl:ml-68.5 relative h-full transition-all duration-200">
	<section class="h-full w-full dark:bg-gray-900">
		<div class="mx-auto h-full w-full">
			<!-- User Cover IMAGE -->
			<img
				src="/images/ryunosuke-kikuno-RKwivgSTXVI-unsplash.jpg"
				alt="User Cover"
				class="xs:h-[9.5rem] w-full rounded-md object-cover sm:h-[13rem] md:h-[16rem] lg:h-[22rem] xl:h-[20rem]"
			/>
			<!-- User Profile Image -->
			<div class="mx-auto flex w-full justify-center">
				{#if loading}
					<svg class="animate-pulse xs:w-[8rem] xs:h-[8rem] xs:bottom-[4.3rem] relative rounded-full object-cover shadow-xl outline outline-2 outline-offset-2 outline-green-500 sm:bottom-[5rem] sm:h-[10rem] sm:w-[10rem] md:bottom-[6rem] md:h-[12rem] md:w-[12rem] lg:bottom-[8rem] lg:h-[16rem] lg:w-[16rem] xl:bottom-[7rem] xl:h-[16rem] xl:w-[16rem] w-8 h-8 text-gray-200 dark:text-gray-700 me-4"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>ProfileIcon</title><circle cx="16" cy="16" r="16" fill="#666"/>
						<path d="M12.73 13.1a3.271 3.271 0 1 1 3.27 3.2 3.237 3.237 0 0 1-3.27-3.2zm-2.73 9.069h1.088a4.91 4.91 0 0 1 9.818 0h1.094a5.884 5.884 0 0 0-3.738-5.434 4.238 4.238 0 0 0 2.1-3.635 4.366 4.366 0 0 0-8.73 0 4.238 4.238 0 0 0 2.1 3.635 5.878 5.878 0 0 0-3.732 5.434z" fill="#eee"/>
						<path fill="none" d="M0 0h32v32h-32z"/>
					</svg>
				{:else}
					<img
						src={user.image}
						on:click={() => (openEditProfile = true)}
						alt="User Profile"
						class="xs:w-[8rem] xs:h-[8rem] xs:bottom-[4.3rem] relative rounded-full object-cover shadow-xl outline outline-2 outline-offset-2 outline-green-500 sm:bottom-[5rem] sm:h-[10rem] sm:w-[10rem] md:bottom-[6rem] md:h-[12rem] md:w-[12rem] lg:bottom-[8rem] lg:h-[16rem] lg:w-[16rem] xl:bottom-[7rem] xl:h-[16rem] xl:w-[16rem]"
					/>
				{/if}
			</div>

			<div
				class="xs:w-[92%] xs:-top-[2.2rem] relative mx-auto flex flex-col items-center justify-center gap-4 sm:-top-[3rem] sm:w-[96%] md:-top-[4rem] md:w-[94%] lg:-top-[6rem] lg:w-[90%] xl:-top-[6rem] xl:w-[80%]"
			>
				<!-- FullName -->
				<h1 class="text-center text-4xl text-gray-800 dark:text-white">
					{user.name + ' ' + user.surname}
				</h1>

				<!-- About -->
				<div
					class="overflow-hidden rounded-lg border bg-white shadow dark:border-gray-700 dark:bg-gray-800"
				>
					<div class="px-2 py-5 sm:px-6">
						<h3 class="text-center text-lg font-medium leading-6 text-gray-900 dark:text-white">
							Profile information
						</h3>
					</div>
					<div class="border-t border-gray-200 px-4 py-2 dark:border-gray-600 sm:p-0">
						<dl class="sm:divide-y sm:divide-gray-200 dark:sm:divide-gray-600">
							<div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
								<dt class="text-sm font-medium text-gray-500 dark:text-white">Full name :</dt>
								<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
									{user.name + ' ' + user.surname}
								</dd>
							</div>
							<div class="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5">
								<dt class="text-sm font-medium text-gray-500 dark:text-white">Email address :</dt>
								<dd class="mt-1 text-sm text-gray-900 dark:text-white sm:col-span-2 sm:mt-0">
									{user.email}
								</dd>
							</div>
						</dl>
					</div>
				</div>

				<!-- Update Link -->
				<div class="flex rounded-sm px-2">
					<Button on:click={() => (update = !update)}>Update Details</Button>
				</div>

			</div>
		</div>
	</section>
</div>

<!-- Edit Modal -->
<Modal id="deleteModal" bind:open={openEditProfile} size="md" placement="center">
	<form
		class="p-6 text-center"
	>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Edit Profile Picture
		</h3>
		<div class="flex justify-center">
			<Gallery class="gap-4 py-2">
				<img class="h-96 w-96 rounded-full" src={user.image} alt='Proffile' />
			</Gallery>
		</div>
		<div class="flex justify-center gap-4">
    		<Button on:click={() => {
                openEditProfile = false;
                openFileHandlingModal = true;
            }}>Upload</Button>
    		<Button color='red' on:click={() => {
                openEditProfile = false;
                openDeleteModal = true;
            }}>Delete</Button>
			<Button color='alternative' on:click={() => (openEditProfile = false)}>Cancel</Button>
		</div>
	</form>
</Modal>

<!-- Delete Modal -->
<DeleteProfilePic bind:open={openDeleteModal} />

<!-- File Handling Modal -->
<UploadPicture bind:open={openFileHandlingModal} />

<!-- Update forms -->
 {#if update}
	<Settings user={user} />
 {/if}