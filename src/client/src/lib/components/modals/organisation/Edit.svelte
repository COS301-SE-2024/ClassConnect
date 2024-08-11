<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Fileupload, Helper } from 'flowbite-svelte';
	import toast, {Toaster} from 'svelte-french-toast';

	export let id: string;
	export let open: boolean;

	export let _name: string;

	let error: string;

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
			const promise = new Promise((resolve, reject) => {
				setTimeout(async () => {
					try {
						if (result.type === 'success') {
							await update();
							open = false;
							resolve('Organisation detials changed successfully!');
						} else {
							reject(result.data?.error || 'An unknown error occurred');
						}
					} catch (error) {
						reject(error);
					} finally {
					}
				}, 500);
			});

			toast.promise(
				promise,
				{
					loading: 'Changing detials...',
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
		action="?/edit"
		class="flex flex-col"
		use:enhance={close}
		enctype="multipart/form-data"
	>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Organisation</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} readonly />

		<Label for="name" class="mb-2 mt-2 text-left">New Name</Label>
		<Input type="text" id="name" name="name" value={_name} size="md" />

		<Label for="with_helper" class="pb-2">New Logo</Label>
		<Fileupload id="with_helper" name="file" class="mb-2" />
		<Helper>SVG, PNG or JPG (MAX. 1 MB).</Helper>

		<Button type="submit" class="mt-4 w-full">Save</Button>
	</form>
</Modal>
