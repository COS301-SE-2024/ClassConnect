<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	let open = false;
</script>

<Button on:click={() => (open = true)} class="mx-2">Create New Organisation</Button>

<Modal bind:open size="xs" autoclose={false} class="w-full">
	<form method="POST" action="?/create" class="flex flex-col space-y-6" use:enhance>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create New Organisation</h3>

		<Label for="name" class="mb-2 mt-2 space-y-2">Organisation Name</Label>
		<Input type="text" id="name" name="name" placeholder="Example University" size="md" required />

		<Label for="image" class="mb-2 mt-2 space-y-2">Image</Label>
		<Input
			type="text"
			id="image"
			name="image"
			placeholder="https://example.com/logo.png"
			size="md"
			required
		/>

		<Button type="submit" class="w-full">Create Organisation</Button>
	</form>
</Modal>
