<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	export let id: string;
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
		action="?/edit"
		class="flex flex-col space-y-6"
		use:enhance={close}
		enctype="multipart/form-data"
	>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit {role}</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} />

		<Label for="name" class="space-y-2">
			<span>Name</span>
			<Input type="text" id="name" name="name" placeholder="John" />
		</Label>

		<Label for="surname" class="space-y-2">
			<span>Surname</span>
			<Input type="text" id="surname" name="surname" placeholder="Doe" />
		</Label>

		<Label for="email" class="space-y-2">
			<span>Email</span>
			<Input type="email" id="email" name="email" placeholder="johndoe@email.com" />
		</Label>

		<Button type="submit" class="w-full1">Edit {role}</Button>
	</form>
</Modal>
