<script lang="ts">
	import { Button } from 'flowbite-svelte';

	import { formatDate } from '$utils/date';
	import Upcoming from '$lib/components/lecturer/lessons/Upcoming.svelte';
	import InSession from '$lib/components/lecturer/lessons/InSession.svelte';
	import ScheduleModal from '$lib/components/lecturer/modals/lessons/Schedule.svelte';

	export let data: any;

	let isScheduleModalOpen = false;

	let upcomingLessons: any[] = [];
	let inSessionLessons: any[] = [];

	$: ({ role, lessons } = data);

	$: {
		const now = new Date();

		lessons = lessons.map((lesson: any) => ({
			...lesson,
			date: formatDate(new Date(lesson.date)),
			unformattedDate: new Date(lesson.date)
		}));

		upcomingLessons = lessons.filter((lesson: any) => lesson.unformattedDate > now);
		inSessionLessons = lessons.filter((lesson: any) => lesson.unformattedDate <= now);
	}
</script>

<main class="container mx-auto my-2 px-4">
	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Lessons</h2>
				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
				>
					{lessons.length} lessons
				</span>
			</div>
		</div>
		{#if role === 'lecturer'}
			<Button size="sm" on:click={() => (isScheduleModalOpen = true)}>Schedule Lesson</Button>
		{/if}
	</div>
	<br />

	{#if lessons.length === 0}
		<p class="text-l text-gray-800 dark:text-white">
			There are no lessons scheduled at the moment.
		</p>
	{:else}
		<InSession lessons={inSessionLessons} {role} />
		<Upcoming lessons={upcomingLessons} {role} />
	{/if}
</main>

<ScheduleModal open={isScheduleModalOpen} />
