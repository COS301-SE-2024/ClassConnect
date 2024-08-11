<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Fileupload } from 'flowbite-svelte';
	import toast, {Toaster} from 'svelte-french-toast';
	import Loading from '$lib/components/common/SubmitLoader.svelte';

	export let role: string;
	export let open: boolean;

	let error: string;
	let value: string;
	let loading: boolean;

	function close({ formData, cancel }: any) {
		const image = formData.get('image') as File;

		if (image && image.name !== "") {
			const extension = image.name.split('.').pop()?.toLowerCase();

			if (image.size > 1000000) {
				toast.error('The size of file should be less than 1 MB!');
				cancel();
				return;
			}

			const imageExtensions = ['jpg', 'jpeg', 'png', 'svg'];

			if (!(extension && imageExtensions.includes(extension))) {
				toast.error('File type is not supported');
				cancel();
				return;
			}
		}

		return ({ result, update }: any) => {
			loading = true; // Set loading state to true when form submission starts

			const promise = new Promise((resolve, reject) => {
				setTimeout(async () => {
					try {
						if (result.type === 'success') {
							await update();
							open = false;
							resolve(`${role} succesfully added!`);
						} else {
							reject(result.data?.error || 'An unknown error occurred');
						}
					} catch (error) {
						reject(error);
					} finally {
						loading = false; // Reset loading state after form submission is complete
					}
				}, 500);
			});

			toast.promise(
				promise,
				{
					loading: `Adding ${role}...`,
					success: (message) => `${message}`,
					error: (error) => `${error}`
				}
			);

			return promise;
		};
	}
</script>

<Toaster/>
<Modal bind:open size="xs" class="w-full">
	<form
		method="POST"
		action="?/add"
		class="flex flex-col space-y-6"
		use:enhance={close}
		enctype="multipart/form-data"
	>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add new {role}</h3>
		
		<Label for="name" class="space-y-2">
			<span>Name</span>
			<Input type="text" id="name" name="name" placeholder="John" required />
		</Label>
		<Label for="surname" class="space-y-2">
			<span>Surname</span>
			<Input type="text" id="surname" name="surname" placeholder="Doe" required />
		</Label>
		<Label for="email" class="space-y-2">
			<span>Email</span>
			<Input type="email" id="email" name="email" placeholder="johndoe@email.com" required />
		</Label>
		<Label for="image" class="space-y-2">
			<span>Profile Picture</span>
			<Fileupload bind:value id="image" name="image" />
		</Label>
		<Button type="submit" class="w-full1">Add {role}</Button>
	</form>
<!-- <Loading {loading} text="Submitting"/> -->
</Modal>

<!--
<Modal bind:open size="xs" class="w-full">
	<form
		method="POST"
		action="?/add"
		class="flex flex-col"
		use:enhance={close}
		enctype="multipart/form-data"
	>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New {role}</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Label for="name" class="mb-2 mt-2 text-left">Name</Label>
		<Input type="text" id="name" name="name" placeholder="John" size="md" required />

		<Label for="surname" class="mb-2 mt-2 text-left">Surname</Label>
		<Input type="text" id="surname" name="surname" placeholder="Doe" size="md" required />

		<Label for="email" class="mb-2 mt-2 text-left">Email</Label>
		<Input
			type="email"
			id="email"
			name="email"
			size="md"
			required
			placeholder="johndoe@example.com"
		/>

		<Button type="submit" class="mt-4 w-full">Add {role}</Button>
	</form>
</Modal>
-->
