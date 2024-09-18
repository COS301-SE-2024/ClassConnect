<script lang="ts">
	import { Button, Modal, Gallery } from 'flowbite-svelte';
	import DeleteProfilePic from '$lib/components/modals/settings/DeleteProfilePic.svelte';
	import UploadPicture from '$lib/components/modals/settings/UploadPicture.svelte';
	import UpdateGeneralDetails from '$lib/components/forms/UpdateGeneralDetails.svelte';
	import UpdatePassword from '$lib/components/forms/UpdatePassword.svelte';
	import { change } from '$lib/store';
	import { getUserData } from '$lib/utils';
	import { onMount } from 'svelte';
	export let user: any;

	let openEditProfile = false;
	let openDeleteModal = false;
	let openFileHandlingModal = false;
	let update = false;
	export let loading: boolean;

	async function updateUserData() {
		loading = true;
		try {
			user = await getUserData();
			loading = false;
		} catch (error) {
			console.error('There was a problem with the get operation');
			loading = false;
		} finally {
			loading = false;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Enter' || event.key === ' ') {
			openEditProfile = true;
		}
	}

	onMount(async () => {
		loading = false;
		await updateUserData();
		console.log('Updated loading state:', loading);
		console.log('Updated user state:', user);
	});

	$: {
		change.subscribe(async () => {
			await updateUserData();
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
				<button
					type="button"
					on:click={() => (openEditProfile = true)}
					on:keydown={handleKeyDown}
					data-testid="editProfileButtonProfile"
					class="xs:w-[8rem] xs:h-[8rem] xs:bottom-[4.3rem] relative rounded-full object-cover shadow-xl outline outline-2 outline-offset-2 outline-green-500 sm:bottom-[5rem] sm:h-[10rem] sm:w-[10rem] md:bottom-[6rem] md:h-[12rem] md:w-[12rem] lg:bottom-[8rem] lg:h-[16rem] lg:w-[16rem] xl:bottom-[7rem] xl:h-[16rem] xl:w-[16rem]"
				>
					<img
						src={user.image}
						alt="User Profile"
						class="h-full w-full animate-pulse rounded-full object-cover"
						class:animate-pulse={loading}
					/>
				</button>
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
					<Button data-testid="updatedetailsbtn" on:click={() => (update = !update)}
						>Update Details</Button
					>
				</div>
			</div>
		</div>
	</section>
</div>

<!-- Edit Modal -->
<Modal
	id="deleteModal"
	data-testid="editModalProfile"
	bind:open={openEditProfile}
	size="md"
	placement="center"
>
	<form class="p-6 text-center">
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Edit Profile Picture</h3>
		<div class="flex justify-center">
			<Gallery class="gap-4 py-2">
				<img class="h-96 w-96 rounded-full" src={user.image} alt="Profile" />
			</Gallery>
		</div>
		<div class="flex justify-center gap-4">
			<Button
				on:click={() => {
					openEditProfile = false;
					openFileHandlingModal = true;
				}}>Upload</Button
			>
			<Button
				color="red"
				on:click={() => {
					openEditProfile = false;
					openDeleteModal = true;
				}}>Delete</Button
			>
			<Button color="alternative" on:click={() => (openEditProfile = false)}>Cancel</Button>
		</div>
	</form>
</Modal>

<!-- Delete Modal -->
<DeleteProfilePic bind:open={openDeleteModal} />

<!-- File Handling Modal -->
<UploadPicture bind:open={openFileHandlingModal} />

<!-- Update forms -->
{#if update}
	<div
		data-testid="updateforms"
		class="grid grid-cols-1 px-4 pt-6 dark:bg-gray-900 xl:grid-cols-3 xl:gap-4"
	>
		<div class="col-span-10 items-center">
			<UpdateGeneralDetails name={user.name} email={user.email} surname={user.surname} />
			<UpdatePassword />
		</div>
	</div>
{/if}
