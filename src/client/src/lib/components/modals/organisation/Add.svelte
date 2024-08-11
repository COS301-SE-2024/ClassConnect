<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Fileupload, Helper } from 'flowbite-svelte';
	import toast, {Toaster} from 'svelte-french-toast';

	export let open: boolean;

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
							resolve('Organisation added successfully!');
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
					loading: 'Adding organisation...',
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
		action="?/create"
		class="flex flex-col"
		use:enhance={close}
		enctype="multipart/form-data"
	>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create New Organisation</h3>

		<Label for="name" class="mb-2 mt-2 text-left">Name</Label>
		<Input type="text" id="name" name="name" placeholder="Example University" size="md" required />

		<Label for="image" class="pb-2">Logo</Label>
		<Fileupload id="image" name="image" class="mb-2" />
		<Helper>SVG, PNG or JPG (MAX. 10 MB).</Helper>

		<Button type="submit" class="mt-4 w-full">Create Organisation</Button>
	</form>
</Modal>
