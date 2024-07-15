<script lang="ts">
	import { Timeline, TimelineItem } from 'flowbite-svelte';
	import { CalendarWeekSolid } from 'flowbite-svelte-icons';
	

	export let data: any;
	$: ({ activities } = data);
	
	$: console.log("Activities:", activities);

	
</script>

<main class="container mx-auto my-8 px-4">
	<h1 class="text-2xl font-bold mb-4">Workspace Activities</h1>
	{#if activities.length === 0}
		<p class="text-gray-700 dark:text-gray-300">No activities found for this workspace.</p>
	{:else}
		<Timeline order="vertical">
			{#each activities as activity (activity.id)}
				<TimelineItem title={activity.title} date={`Released on ${new Date(activity.date).toLocaleDateString()}`}>
					<svelte:fragment slot="icon">
						<span class="flex absolute -start-3 justify-center items-center w-6 h-6 bg-primary-200 rounded-full ring-8 ring-white dark:ring-gray-900 dark:bg-primary-900">
							<CalendarWeekSolid class="w-4 h-4 text-primary-600 dark:text-primary-400" />
						</span>
					</svelte:fragment>
					<p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">
						{activity.description}
					</p>
				</TimelineItem>
			{/each}
		</Timeline>
	{/if}
</main>


