<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	
	let formModal = false;

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		try {
			const response = await fetch('/admin/admins?/add', {
				method: 'POST',
				body: formData
			});
			console.log(response)
		} catch (error) {
			console.error('Create User Error:', error);
		}

		formModal = false;
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
		<Input type="text" id="name" name="name" placeholder="John" size="md" required />

		<Label for="surname" class="mb-2 mt-2 space-y-2">Surname</Label>
		<Input type="text" id="surname" name="surname" placeholder="Doe" size="md" required />

		<Label for="email" class="mb-2 mt-2 space-y-2">Email</Label>
		<Input type="text" id="email" name="email" placeholder="email@example.com" size="md" required />

		<Button type="submit" class="w-full1">Add Admin</Button>
	</form>
</Modal>
