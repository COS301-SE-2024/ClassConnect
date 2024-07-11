<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	export let role: string;
	export let open: boolean;

	let error: string;

	function close() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				open = false;
			} else {
				error = result.data?.error;
			}
		};
	}
</script>

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

		<Label for="upload_image" class="mb-2 mt-2 space-y-2">Upload image:</Label>
		<Input type="file" id="image" name="image" />

		<Button type="submit" class="mt-4 w-full">Add {role}</Button>
	</form>
</Modal>
