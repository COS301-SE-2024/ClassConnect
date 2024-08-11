<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Select, Fileupload } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';

	export let id: string;
	export let open: boolean;
	export let lecturers: [{ id: string; name: string; surname: string }];

	let error: string;
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
							resolve('Workspace changed successfully!');
						} else {
							reject(result.data?.error || 'An unknown error occurred');
						}
					} catch (error) {
						reject(error);
					}
				}, 500);
			});

			toast.promise(promise, {
				loading: 'Changing workspace...',
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
		action="?/edit"
		class="flex flex-col space-y-6"
		use:enhance={close}
		enctype="multipart/form-data"
	>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Workspace</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}
		<Input type="hidden" id="id" name="id" value={id} />
		<Label for="code" class="space-y-2">
			<span>Code</span>
			<Input
				type="text"
				id="code"
				name="code"
				placeholder="Please enter a workspace code (e.g. PHY 114)"
				required
			/>
		</Label>
		<Label for="name" class="space-y-2">
			<span>Name</span>
			<Input
				type="text"
				id="name"
				name="name"
				placeholder="Please enter a workspace name (e.g. Physical Sciences)"
				required
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
		<Button type="submit" class="w-full1">Edit Workspace</Button>
	</form>
</Modal>
