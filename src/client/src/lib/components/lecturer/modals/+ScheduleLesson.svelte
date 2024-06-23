<script lang="ts">
	import { Button, Modal, Label, Input } from 'flowbite-svelte';
	import { schedules } from '$lib/services/schedule';
	import { lessons } from '$lib/store';
	import { onMount } from 'svelte';

	let formModal = false;
	let userID = '';
	let workspaceID = 'abcdefg';
	

	//Function to store LessonScheduleID
	function storeLessonID(id: string): void {
		localStorage.setItem('scheduleID', id);
		console.log('scheduleID', id);
	}

	//this wil retrieve the lectureID and workspace ID from local storage
	onMount(() => {
		userID= localStorage.getItem('userID') || 'non-existent';
		//localStorage.setItem('workspaceID', workspaceID);
	});

	async function handleSubmit(event: Event) {
		console.log('Schedule Lesson is being handled');
		event.preventDefault();

		const formData = new FormData(event.target as HTMLFormElement);

		const topic = formData.get('topic')?.toString() ?? '';
		console.log('This is topic:', topic);
		const date = formData.get('date')?.toString() ?? '';
		console.log('This is date:', date);
		const time = formData.get('time')?.toString() ?? '';
		console.log('This is time:', time);

		try {
			const response = await schedules(topic, userID, workspaceID, date);

			console.log('Response:', response);

			if (response) {
				storeLessonID(response._id);
				lessons.update(currentLessons => [
					...currentLessons,
					{ topic, date, time }
				]);
			}
		} catch (error) {
			console.error('Schedule Lesson Error:', error);
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
	<span class="px-2">Schedule Lesson</span>
</Button>

<Modal bind:open={formModal} size="xs" autoclose={false} class="w-full">
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
