<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Fileupload } from 'flowbite-svelte';
	import toast, {Toaster} from 'svelte-french-toast';
	import Loading from '$lib/components/common/SubmitLoader.svelte';

	export let id: string;
	export let role: string;
	export let open: boolean;

	export let _name: string;
	export let surname: string;
	export let email: string;

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
							resolve(`${role} details changed successfully!`);
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
					loading: 'Changing detials..',
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
	<!-- <Loading {loading} text="Loading"/> -->
	<form
		method="POST"
		action="?/edit"
		class="flex flex-col space-y-6"
		use:enhance={close}
		enctype="multipart/form-data"
	>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit {role}</h3>


		<Input type="hidden" id="id" name="id" value={id} />

		<Label for="name" class="space-y-2">
			<span>Name</span>
			<Input type="text" id="name" name="name" value={_name} />
		</Label>

		<Label for="surname" class="space-y-2">
			<span>Surname</span>
			<Input type="text" id="surname" name="surname" value={surname} />
		</Label>

		<Label for="email" class="space-y-2">
			<span>Email</span>
			<Input type="email" id="email" name="email" value={email} />
		</Label>

		<Button type="submit" class="w-full1">Edit {role}</Button>
	</form>
</Modal>
