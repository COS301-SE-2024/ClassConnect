<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';

	export let open boolean;
</script>

<Modal bind:open={open} size="xs" autoclose={false} class="w-full">
	<form class="flex flex-col space-y-6" on:submit={handleSubmit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Schedule Lesson</h3>

		<Label for="topic" class="mb-2 mt-2 space-y-2">Topic</Label>
		<Input type="text" id="topic" name="topic" placeholder="Mathematics" size="md" required />

		<Label for="date" class="mb-2 mt-2 space-y-2">Date</Label>
		<Input type="date" id="date" name="date" placeholder="23 June" size="md" required />

		<Label for="time" class="mb-2 mt-2 space-y-2">Time</Label>
		<Input type="time" id="time" name="time" placeholder="12:00" size="md" required />

		<Button type="submit" class="w-full1">Schedule</Button>
	</form>
</Modal>
