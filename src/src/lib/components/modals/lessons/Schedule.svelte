<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Modal, Label, Input, Textarea, Select } from 'flowbite-svelte';

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
	<form method="POST" action="?/schedule" class="flex flex-col" use:enhance={close}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Schedule New Lesson</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Label for="topic" class="mb-2 mt-2 text-left">Topic</Label>
		<Input type="text" id="topic" name="topic" placeholder="Physics" size="md" required />

		<Label for="description" class="mb-2 mt-2 text-left">Description</Label>
		<Textarea
			type="text"
			id="description"
			name="description"
			placeholder="Introduction to thermal dynamics"
			size="md"
		/>

		<Label for="date" class="mb-2 mt-2 space-y-2">Date</Label>
		<Input type="date" id="date" name="date" placeholder="13 September" size="md" required />

		<Label for="time" class="mb-2 mt-2 space-y-2">Time</Label>
		<Input type="time" id="time" name="time" size="md" required />

		<Label for="recurrence" class="mb-2 mt-2 space-y-2">Recurrence</Label>
		<Select id="recurrence" name="recurrence" size="md" required>
			<option value="none">None</option>
			<option value="daily">Daily</option>
			<option value="weekly">Weekly</option>
		</Select>

		<Button type="submit" class="mt-4 w-full">Save</Button>
	</form>
</Modal>
