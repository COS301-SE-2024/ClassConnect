<script lang="ts">
	import { enhance } from '$app/forms';
	import toast, { Toaster } from 'svelte-french-toast';
	import { Button, Modal, Label, Input, Fileupload, Helper, Tabs, TabItem } from 'flowbite-svelte';

	export let role: string;
	export let open: boolean;

	let value: string;
	let activeTab = 0;

	function closeSingle({ formData, cancel }: any) {
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
		return handleSubmit('single');
	}

	function closeMulti({ formData, cancel }: any) {
		const file = formData.get('csv') as File;

		if (file && file.name !== '') {
			const extension = file.name.split('.').pop()?.toLowerCase();
			if (file.size > 4000000) {
				toast.error('The size of file should be less than 4 MB!');
				cancel();
				return;
			}
			if (extension != 'csv') {
				toast.error('File type is not supported');
				cancel();
				return;
			}
		}
		return handleSubmit('multi');
	}

	function handleSubmit(type: 'single' | 'multi') {
		return ({ result, update }: any) => {
			const promise = new Promise((resolve, reject) => {
				setTimeout(async () => {
					try {
						if (result.type === 'success') {
							await update();
							open = false;
							resolve(`${role}${type === 'multi' ? 's' : ''} successfully added!`);
						} else {
							reject(result.data?.error || 'An unknown error occurred');
						}
					} catch (error) {
						reject(error);
					}
				}, 500);
			});
			toast.promise(promise, {
				loading: `Adding ${role}${type === 'multi' ? 's' : ''}...`,
				success: (message) => `${message}`,
				error: (error) => `${error}`
			});
			return promise;
		};
	}
</script>

<Toaster />

<Modal bind:open size="xs" class="w-full">
	<Tabs style="underline" bind:activeTab>
		<TabItem open title="Single">
			<form
				method="POST"
				action="?/add"
				class="flex flex-col space-y-6"
				use:enhance={closeSingle}
				enctype="multipart/form-data"
			>
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add {role}</h3>
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
					<span>Image</span>
					<Fileupload bind:value id="image" name="image" />
				</Label>
				<Button type="submit" class="w-full">Add {role}</Button>
			</form>
		</TabItem>

		<TabItem title="Multiple">
			<form
				method="POST"
				action="?/addMulti"
				class="flex flex-col space-y-6"
				use:enhance={closeMulti}
				enctype="multipart/form-data"
			>
				<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Multiple {role}s</h3>
				<Label for="csv" class="space-y-2">
					<span>{role}s CSV</span>
					<Fileupload bind:value id="csv" name="csv" />
					<Helper>Only CSV files are supported</Helper>
				</Label>
				<Button type="submit" class="w-full">Add {role}s</Button>
			</form>
		</TabItem>
	</Tabs>
</Modal>
