<script>
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	let formModal = false;

	// Function to handle form submission
	async function handleSubmit(event) {
		event.preventDefault();
	}
</script>

<Button on:click={() => (formModal = true)} class="mx-2">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="h-5 w-5"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
		/>
	</svg>
	<span class="px-2">Add Admin</span>
</Button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add New Admin</h3>

		<Label for="name" class="mb-2 mt-2 space-y-2">Name</Label>
		<Input type="text" id="name" name="name" placeholder="Example University" size="md" required />

		<Label for="email" class="mb-2 mt-2 space-y-2">Email</Label>
		<Input type="text" id="email" name="email" placeholder="email@example.com" size="md" required />

		<Label for="email" class="mb-2 mt-2 space-y-2">Department</Label>
		<Input type="text" id="department" name="department" placeholder="Arts" size="md" required />

		<Button type="submit" class="w-full1">Add Admin</Button>
	</form>
</Modal>
