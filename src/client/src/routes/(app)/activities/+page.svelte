<script lang="ts">
	import { Timeline, TimelineItem } from 'flowbite-svelte';
	export let data;
</script>

<main class="w-full dark:bg-gray-800">
	<div class="text-center">
		<h1 class="text-4xl font-semibold capitalize text-gray-800 lg:text-3xl dark:text-white">
			Activities
		</h1>
	</div>

	<Timeline>
		{#each data.activities as activity}
			<TimelineItem title={activity.title} date={activity.date}>
				<p class="text-base font-normal text-gray-500 dark:text-gray-400">{activity.activity}</p>
			</TimelineItem>
		{/each}
	</Timeline>
</main>
