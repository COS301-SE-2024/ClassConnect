<script lang="ts">
	import { Timeline, TimelineItem } from 'flowbite-svelte';

	const activities = [
		{
			title: 'Budget Planning Meeting',
			date: '15 Oct',
			activity:
				'Attend and contribute to the annual budget planning meeting to allocate resources for the upcoming academic year.'
		},
		{
			title: 'Faculty Evaluation',
			date: '18 Oct',
			activity:
				'Conduct evaluations for tenured and non-tenured faculty members, reviewing their performance and providing feedback.'
		},
		{
			title: 'Student Affairs Committee',
			date: '20 Oct',
			activity:
				'Participate in the Student Affairs Committee meeting to discuss and address student concerns and initiatives.'
		},
		{
			title: 'Campus Safety Review',
			date: '22 Oct',
			activity:
				'Review campus safety protocols and emergency procedures with the safety department to ensure the well-being of students and staff.'
		},
		{
			title: 'Strategic Planning Workshop',
			date: '25 Oct',
			activity:
				'Engage in a strategic planning workshop to set long-term goals and objectives for the university’s growth and development.'
		},
		{
			title: 'Alumni Networking Event',
			date: '30 Oct',
			activity:
				'Host an alumni networking event to strengthen relationships with former students and encourage their involvement in university activities.'
		}
	];
</script>

<div class="w-full">
	<div class="text-center">
		<h1 class="text-4xl font-semibold capitalize text-gray-800 dark:text-white lg:text-3xl">
			Activities
		</h1>
	</div>
	<Timeline>
		{#each activities as activity}
			<TimelineItem title={activity.title} date={activity.date}>
				<p class="text-base font-normal text-gray-500 dark:text-gray-400">{activity.activity}</p>
			</TimelineItem>
		{/each}
	</Timeline>
</div>
