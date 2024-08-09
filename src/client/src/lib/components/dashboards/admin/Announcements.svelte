<script>
	import { Table, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	const announcements = [
		{
			title: 'School Closure',
			date: 'August 10, 2024',
			content:
				'Due to severe weather conditions, the school will be closed for the day. Please stay safe and await further updates.'
		},
		{
			title: 'Parent-Teacher Conference',
			date: 'August 15, 2024',
			content:
				"We will be holding a parent-teacher conference from 3 PM to 6 PM. Please schedule your appointments with your child's teacher."
		},
		{
			title: 'Sports Day',
			date: 'August 20, 2024',
			content:
				'Our annual Sports Day will take place on August 20th. Students are encouraged to participate and show their school spirit!'
		}
	];
</script>

<div class="mb-6 flex items-center justify-between">
	<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">Announcements</h5>
	<a href="/" class="text-primary-600 dark:text-primary-500 text-sm font-medium">View All</a>
</div>

<Table divClass="overflow-x-auto w-full">
	<TableBody>
		{#each announcements as announcement}
			<TableBodyRow>
				<div class="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
					{announcement.date}
				</div>

				<h3 class="mx-1 text-lg font-semibold text-gray-900 dark:text-white">
					{announcement.title}
				</h3>

				<p class="text-md my-2 text-gray-700 dark:text-gray-300">{announcement.content}</p>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
