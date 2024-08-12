<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Select, Fileupload } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	export let open: boolean;
	export let lecturers: [{ id: string; name: string; surname: string }];

	let value: string;

	function close({ formData, cancel }: any) {
		const image = formData.get('image') as File;

		if (image && image.name !== '') {
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
			const promise = new Promise((resolve, reject) => {
				setTimeout(async () => {
					try {
						if (result.type === 'success') {
							await update();
							open = false;
							resolve('Workspace added successfully!');
						} else {
							reject(result.data?.error || 'An unknown error occurred');
						}
					} catch (error) {
						reject(error);
					}
				}, 500);
			});

			toast.promise(promise, {
				loading: 'Adding workspace...',
				success: (message) => `${message}`,
				error: (error) => `${error}`
			});

			return promise;
		};
	}
</script>

<Toaster />
<Modal bind:open size="xs" class="w-full">
	<form
		method="POST"
		action="?/create"
		class="flex flex-col space-y-6"
		use:enhance={close}
		enctype="multipart/form-data"
	>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create New Workspace</h3>

		<Label for="name" class="space-y-2">
			<span>Name</span>
			<Input type="text" id="name" name="name" placeholder="Physical Sciences" required />
		</Label>

		<Label for="description" class="space-y-2">
			<span>Description</span>
			<Input
				type="text"
				id="description"
				name="description"
				placeholder="Introduction to Physical Sciences"
			/>
		</Label>

		<Label for="owner" class="space-y-2">
			<span>Lecturer</span>
			<Select id="owner" name="owner" required>
				{#each lecturers as lecturer}
					<option value={lecturer.id}>{lecturer.name} {lecturer.surname}</option>
				{/each}
			</Select>
		</Label>

		<Label for="image" class="space-y-2">
			<span>Image</span>
			<Fileupload bind:value id="image" name="image" />
		</Label>

		<Button type="submit" class="w-full1">Create Workspace</Button>
	</form>
</Modal>
