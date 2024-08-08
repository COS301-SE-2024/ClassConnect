<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Fileupload } from 'flowbite-svelte';

	export let id: string;
	export let role: string;
	export let open: boolean;

	let error: string;
	let value: string;

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
		<Label for="image" class="space-y-2">
			<span>Profile Picture</span>
			<Fileupload bind:value id="image" name="image" />
		</Label>
		<Button type="submit" class="w-full1">Edit {role}</Button>
	</form>
</Modal>

<!--
<Modal bind:open size="xs" class="w-full">
	<form method="POST" action="?/edit" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit {role}</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Input type="hidden" id="id" name="id" value={id} size="md" readonly />

		<Label for="name" class="mb-2 mt-2 text-left">New Name</Label>
		<Input type="text" id="name" name="name" placeholder="John" size="md" />

		<Label for="surname" class="mb-2 mt-2 text-left">New Surname</Label>
		<Input type="text" id="surname" name="surname" placeholder="Doe" size="md" />

		<Label for="email" class="mb-2 mt-2 text-left">New Email</Label>
		<Input type="email" id="email" name="email" size="md" placeholder="johndoe@example.com" />

		<Label for="image" class="mb-2 mt-4 text-left">New Profile Picture</Label>
		<Input
			type="text"
			id="image"
			name="image"
			size="md"
			placeholder="https://example.com/logo.png"
		/>

		<Button type="submit" class="mt-4 w-full">Save</Button>
	</form>
</Modal>
-->
