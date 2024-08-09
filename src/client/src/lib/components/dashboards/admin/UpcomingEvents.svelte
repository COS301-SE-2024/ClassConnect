<script lang="ts">
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	type Event = {
		date: string;
		title: string;
		location: string;
	};

	const upcomingEvents: Event[] = [
		{
			title: 'Parent-Teacher Conference',
			date: 'June 15, 2024',
			location: 'School Auditorium'
		},
		{
			title: 'Science Fair',
			date: 'July 10, 2024',
			location: 'School Gymnasium'
		},
		{
			title: 'Graduation Ceremony',
			date: 'August 1, 2024',
			location: 'Community Center'
		}
	];
</script>

<div class="mb-6 flex items-center justify-between">
	<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Upcoming Events</h5>
	<a href="/" class="text-primary-600 dark:text-primary-500 text-sm font-medium">View all</a>
</div>

<Table divClass="overflow-x-auto">
	<TableBody>
		{#each upcomingEvents as event}
			<TableBodyRow>
				<TableBodyCell>
					<div>
						<div class="text-sm text-gray-500">{event.date}</div>
						<div class="font-semibold">{event.title}</div>
						<div class="text-gray-500">{event.location}</div>
					</div>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
