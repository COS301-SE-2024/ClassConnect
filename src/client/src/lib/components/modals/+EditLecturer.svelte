<script>
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	let formModal = false;

	// Function to handle form submission
	async function handleSubmit(event) {
		event.preventDefault();
	}
</script>

<button
	on:click={() => (formModal = true)}
	class="text-gray-500 transition-colors duration-200 hover:text-green-500 focus:outline-none dark:text-gray-300 dark:hover:text-green-500"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="mx-2 h-5 w-5"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
		/>
	</svg>
</button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Lecturer</h3>

		<Label for="name" class="mb-2 mt-2 space-y-2">Name</Label>
		<Input type="text" id="name" name="name" placeholder="Example University" size="md" required />

		<Label for="email" class="mb-2 mt-2 space-y-2">Email</Label>
		<Input type="text" id="email" name="email" placeholder="email@example.com" size="md" required />

		<Label for="email" class="mb-2 mt-2 space-y-2">Role</Label>
		<Input type="text" id="role" name="role" placeholder="Lecturer" size="md" required />

		<Button type="submit" class="w-full1">Edit Lecturer</Button>
	</form>
</Modal>
