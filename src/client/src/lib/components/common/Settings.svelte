<script lang="ts">
	import {
		Heading,
		Button,
		Modal,
		Input,
		Gallery,
		Fileupload,
		Label,
		Helper
	} from 'flowbite-svelte';
	import { UploadOutline, ExclamationCircleOutline } from 'flowbite-svelte-icons';

    async function handleFileUpload(event: Event) {
		event.preventDefault();
		openPreviewModal = true;
		console.log('Hello');
	}

	const image1 = {
		alt: 'erbology',
		src: 'https://flowbite.s3.amazonaws.com/docs/gallery/featured/image.jpg'
	};

	let openDeleteModal = false;
	let openPreviewModal = false;
	let openUploadModal = false;
	let color: any;
</script>

<div class="grid grid-cols-1 px-4 pt-6 dark:bg-gray-900 xl:grid-cols-3 xl:gap-4">
	<div class="col-span-full mb-4 xl:mb-2">
		<Heading tag="h1" class="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl"
			>Settings</Heading
		>
	</div>
	<div class="col-span-10 items-center">
		<div
			class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
		>
			<div class="items-center sm:flex sm:space-x-4 xl:block xl:space-x-0 2xl:flex 2xl:space-x-4">
				<img
					class="mb-4 h-28 w-28 rounded-lg sm:mb-0 xl:mb-4 2xl:mb-0"
					src="https://class-connect-file-storage.s3.amazonaws.com/pictures/default.svg"
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
								color = 'red';
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
			<form>
				<div class="grid grid-cols-6 gap-6">
					<div class="col-span-6 sm:col-span-3">
						<label
							for="first-name"
							class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">First Name</label
						>
						<input
							type="text"
							name="first-name"
							id="first-name"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
							placeholder="Bonnie"
							required
						/>
					</div>

					<div class="col-span-6 sm:col-span-3">
						<label
							for="last-name"
							class="mb-2 block text-sm font-medium text-gray-900 dark:text-white">Last Name</label
						>
						<input
							type="text"
							name="last-name"
							id="last-name"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
							placeholder="Green"
							required
						/>
					</div>

					<div class="col-span-6 sm:col-span-3">
						<label for="email" class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>Email</label
						>
						<input
							type="email"
							name="email"
							id="email"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
							placeholder="example@company.com"
							required
						/>
					</div>

					<div class="sm:col-full col-span-6">
						<button
							class="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
							type="submit">Update</button
						>
					</div>
				</div>
			</form>
		</div>
		<div
			class="mb-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6 2xl:col-span-2"
		>
			<h3 class="mb-4 text-xl font-semibold dark:text-white">Password information</h3>
			<form>
				<div class="grid grid-cols-6 gap-6">
					<div class="col-span-6 sm:col-span-3">
						<label
							for="current-password"
							class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>Current password</label
						>
						<input
							type="text"
							autocomplete="off"
							name="current-password"
							id="current-password"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500 sm:text-sm"
							placeholder="••••••••"
							required
						/>
					</div>
					<div class="col-span-6 sm:col-span-3">
						<label
							for="password"
							class="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
							>New password</label
						>
						<input
							data-popover-target="popover-password"
							autocomplete="off"
							data-popover-placement="bottom"
							type="password"
							id="password"
							class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
							placeholder="••••••••"
							required
						/>
					</div>
					<div class="sm:col-full col-span-6">
						<button
							class="rounded-lg bg-primary-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
							type="submit">Update password</button
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
			<Button color="red" on:click={() => (openDeleteModal = false)}>Yes, delete it</Button>
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
		<ExclamationCircleOutline class="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to upload this profile picture?
		</h3>
		<Gallery class="gap-4 py-2">
			<img src={image1.src} alt={image1.alt} class="h-auto max-w-full rounded-lg" />
		</Gallery>
		<div class="flex justify-center gap-4">
			<Button color="primary" on:click={() => (openDeleteModal = false)}>Yes, upload it</Button>
			<Button color="alternative" on:click={() => (openDeleteModal = false)}>No, cancel</Button>
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
	<form class="flex flex-col space-y-6" on:Submit={handleFileUpload}>
		<Label for="with_helper" class="pb-2">Upload picture</Label>
		<Fileupload id="with_helper" class="mb-2" />
		<Helper>SVG, PNG, JPG or GIF (MAX. 1mb).</Helper>

		<Button type="submit" class="w-full1">Upload Picture</Button>
	</form>
</Modal>
