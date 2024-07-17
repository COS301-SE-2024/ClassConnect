<script lang="ts">
	import {
		Heading,
		Button,
		Modal,
		Gallery,
		Fileupload,
		Label,
		Helper,
		Input,
		Alert
	} from 'flowbite-svelte';
	import {
		UploadOutline,
		ExclamationCircleOutline,
		EyeOutline,
		EyeSlashOutline,
		InfoCircleSolid
	} from 'flowbite-svelte-icons';

	export let user: any;

	let updateStatus: any = null;
	let GeneralDetailsForm: any;
	let PasswordForm: any;

	let user_det: any;

	async function handleFileUpload(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);
		const file = formData.get('file') as File;

		if (file) {
			ImageFile = file;
			const reader = new FileReader();
			reader.onload = (e) => {
				const url = e.target?.result as string;
				image1.src = url;
				image1.alt = file.name;
				openPreviewModal = true;
				openUploadModal = false;
			};
			reader.readAsDataURL(file);
		}
	}

	async function handleFinalUpload(event: Event) {
		event.preventDefault();

		console.log('Upload is being handled');

		const formData = new FormData();

		formData.append('file', ImageFile);

		console.log(formData);

		const response = await fetch('/settings?/upload_picture', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			updateStatus = 'success';
		} else {
			updateStatus = 'failure';
		}

		reloadPage();

		openPreviewModal = false;
	}

	async function handleFileDelete(event: Event) {
		event.preventDefault();
		console.log('Delete is being handled');

		const formData = new FormData();

		console.log(formData);

		const response = await fetch('/settings?/delete_picture', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			updateStatus = 'success';
		} else {
			updateStatus = 'failure';
		}

		reloadPage();

		openDeleteModal = false;
	}

	async function handleGeneralUpdate(event: Event) {
		event.preventDefault();
		console.log('General update is being handled');

		const formData = new FormData(event.currentTarget as HTMLFormElement);

		console.log(formData);

		const response = await fetch('/settings?/update_general_details', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			updateStatus = 'success';
		} else {
			updateStatus = 'failure';
		}

		reloadPage();
	}

	async function handlePasswordUpdate(event: Event) {
		event.preventDefault();
		console.log('Password update is being handled');

		const formData = new FormData(event.currentTarget as HTMLFormElement);

		console.log(formData);

		const response = await fetch('/settings?/update_password', {
			method: 'POST',
			body: formData
		});

		if (response.ok) {
			updateStatus = 'success';
		} else {
			updateStatus = 'failure';
		}

		reloadPage();
	}

	const image1 = {
		alt: 'erbology',
		src: 'https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg'
	};

	let openDeleteModal = false;
	let openPreviewModal = false;
	let openUploadModal = false;
	let currentShowPassword = false;
	let newShowPassword = false;
	let confirmShowPassword = false;
	let ImageFile: File;

	async function reloadPage() {
		fetch('http://localhost:5173/api/user')
			.then((response) => {
				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				return response.json();
			})
			.then((data) => {
				user_det = data;

				GeneralDetailsForm.reset();

				PasswordForm.reset();

				user = user_det;
			})
			.catch((error) => {
				console.error('There was a problem with your fetch operation:', error);
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
								openUploadModal = true;
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
		<div
			class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
		>
			<h3 class="mb-4 text-xl font-semibold dark:text-white">General information</h3>
			<form bind:this={GeneralDetailsForm} on:submit={handleGeneralUpdate}>
				<div class="grid grid-cols-6 gap-6">
					<div class="col-span-6 sm:col-span-3">
						<Label for="name" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>First Name</Label
						>
						<Input
							type="text"
							name="name"
							id="name"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
							placeholder={user.name}
						/>
					</div>

					<div class="col-span-6 sm:col-span-3">
						<Label
							for="surname"
							class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Last Name</Label
						>
						<Input
							type="text"
							name="surname"
							id="surname"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
							placeholder={user.surname}
						/>
					</div>

					<div class="col-span-6 sm:col-span-3">
						<Label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>Email</Label
						>
						<Input
							type="email"
							name="email"
							id="email"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
							placeholder={user.email}
						/>
					</div>

					<div class="sm:col-full col-span-6">
						<Button
							class="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
							type="submit">Update</Button
						>
					</div>
				</div>
			</form>
		</div>
		<div
			class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
		>
			<h3 class="mb-4 text-xl font-semibold dark:text-white">Password information</h3>
			<form bind:this={PasswordForm} on:submit={handlePasswordUpdate}>
				<div class="grid grid-cols-6 gap-6">
					<div class="col-span-6 sm:col-span-3">
						<Label
							for="currPassword"
							class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>Current password</Label
						>
						<div class="relative">
							<Input
								type={currentShowPassword ? 'text' : 'password'}
								autocomplete="off"
								name="currPassword"
								id="currPassword"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
								placeholder="••••••••"
								required
							/>
							<button
								type="button"
								aria-label="Toggle password visibility"
								class="absolute inset-y-0 right-0 flex items-center pr-3"
								on:click={() => (currentShowPassword = !currentShowPassword)}
							>
								{#if currentShowPassword}
									<EyeSlashOutline class="text-gray-500" />
								{:else}
									<EyeOutline class="text-gray-500" />
								{/if}
							</button>
						</div>
					</div>
					<div class="col-span-6 sm:col-span-3">
						<Label
							for="newPassword"
							class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>New password</Label
						>
						<div class="relative">
							<Input
								data-popover-target="popover-password"
								autocomplete="off"
								data-popover-placement="bottom"
								type={newShowPassword ? 'text' : 'password'}
								id="newPassword"
								name="newPassword"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
								placeholder="••••••••"
								required
							/>
							<button
								type="button"
								aria-label="Toggle password visibility"
								class="absolute inset-y-0 right-0 flex items-center pr-3"
								on:click={() => (newShowPassword = !newShowPassword)}
							>
								{#if newShowPassword}
									<EyeSlashOutline class="text-gray-500" />
								{:else}
									<EyeOutline class="text-gray-500" />
								{/if}
							</button>
						</div>
					</div>
					<div class="col-span-6 sm:col-span-3">
						<Label
							for="conPassword"
							class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>Confirm password</Label
						>
						<div class="relative">
							<Input
								type={confirmShowPassword ? 'text' : 'password'}
								name="conPassword"
								id="conPassword"
								class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
								placeholder="••••••••"
								required
							/>
							<button
								type="button"
								aria-label="Toggle password visibility"
								class="absolute inset-y-0 right-0 flex items-center pr-3"
								on:click={() => (confirmShowPassword = !confirmShowPassword)}
							>
								{#if confirmShowPassword}
									<EyeSlashOutline class="text-gray-500" />
								{:else}
									<EyeOutline class="text-gray-500" />
								{/if}
							</button>
						</div>
					</div>
					<div class="sm:col-full col-span-6">
						<Button
							class="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
							type="submit">Update password</Button
						>
					</div>
				</div>
			</form>
		</div>
	</div>
</div>

<!-- Delete Modal -->
<Modal
	id="deleteModal"
	open={openDeleteModal}
	on:close={() => (openDeleteModal = false)}
	size="md"
	placement="center"
>
	<div class="p-6 text-center">
		<ExclamationCircleOutline class="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this profile picture?
		</h3>
		<div class="flex justify-center gap-4">
			<Button color="red" on:click={handleFileDelete}>Yes, delete it</Button>
			<Button on:click={() => (openDeleteModal = false)}>No, cancel</Button>
		</div>
	</div>
</Modal>

<!-- Preview Modal -->
<Modal
	id="previewModal"
	open={openPreviewModal}
	on:close={() => (openPreviewModal = false)}
	size="lg"
	placement="center"
>
	<div class="p-6 text-center">
		<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">
			Are you sure you want to upload this profile picture?
		</h3>
		<div class="flex justify-center">
			<Gallery class="gap-4 py-2">
				<img class="h-96 w-96 rounded-full" src={image1.src} alt={image1.alt} />
			</Gallery>
		</div>
		<div class="flex justify-center gap-4">
			<Button color="primary" on:click={handleFinalUpload}>Yes, upload it</Button>
			<Button color="alternative" on:click={() => (openPreviewModal = false)}>No, cancel</Button>
		</div>
	</div>
</Modal>

<!-- Upload Modal -->
<Modal
	id="uploadModal"
	open={openUploadModal}
	on:close={() => (openUploadModal = false)}
	size="lg"
	placement="center"
>
	<form class="flex flex-col space-y-6" on:submit={handleFileUpload}>
		<Label for="with_helper" class="pb-2">Upload picture</Label>
		<Fileupload id="with_helper" name="file" class="mb-2" />
		<Helper>SVG, PNG or JPG (MAX. 1 MB).</Helper>

		<Button type="submit" class="w-full">Upload Picture</Button>
	</form>
</Modal>
