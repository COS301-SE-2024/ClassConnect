<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import { updateUser } from '../../../services/users';
	import { stuChange } from '../../stores/store';

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
