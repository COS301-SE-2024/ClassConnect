<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import IconEdit from '@tabler/icons-svelte/IconEdit.svelte';
	import { updateUser } from '$lib/services/users';
	import { stuChange } from '$lib/store';

	export let studentID = '';

	let formModal = false;

	async function handleSubmit(event: Event) {
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const name = formData.get('name')?.toString() ?? '';
		const surname = formData.get('surname')?.toString() ?? '';
		const email = formData.get('email')?.toString() ?? '';

		const newInfo = {
			name: name || undefined,
			surname: surname || undefined,
			email: email || undefined
		};

		try {
			await updateUser(studentID, newInfo);
			stuChange.set('new');
		} catch (error) {
			console.error('Create User Error:', error);
		}

		formModal = false;
	}
</script>

<button
	on:click={() => (formModal = true)}
	class="transition-colors duration-200 hover:text-green-500 focus:outline-none dark:text-gray-300 dark:hover:text-green-500"
>
	<IconEdit stroke={2} />
</button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Student</h3>

		<Label for="name" class="mb-2 mt-2 space-y-2">Name</Label>
		<Input type="text" id="name" name="name" placeholder="John" size="md" />

		<Label for="surname" class="mb-2 mt-2 space-y-2">Surname</Label>
		<Input type="text" id="surname" name="surname" placeholder="Doe" size="md" />

		<Label for="email" class="mb-2 mt-2 space-y-2">Email</Label>
		<Input type="text" id="email" name="email" placeholder="email@example.com" size="md" />

		<Button type="submit" class="w-full1">Edit Students</Button>
	</form>
</Modal>
