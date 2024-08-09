<script>
	import { Table, Badge, TableBody, TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	const applications = [
		{
			image: '/images/profile-placeholder.png',
			name: 'Sthe Nyandeni',
			date: 'Submitted: May 20, 2024',
			status: 'Completed',
			color: 'green'
		},
		{
			image: '/images/profile-placeholder.png',
			name: 'Jason Maritz',
			date: 'Submitted: May 21, 2024',
			status: 'Completed',
			color: 'green'
		},
		{
			image: '/images/profile-placeholder.png',
			name: 'Jake Mileham',
			date: 'Submitted: May 22, 2024',
			status: 'In Progress',
			color: 'yellow'
		},
		{
			image: '/images/profile-placeholder.png',
			name: 'Joshua Wereley',
			date: 'Submitted: May 23, 2024',
			status: 'In Progress',
			color: 'yellow'
		}
	];
</script>

<div class="mb-6 flex items-center justify-between">
	<h5 class="text-xl font-bold leading-none text-gray-900 dark:text-white">
		Admission Letters
	</h5>
	<a href="/" class="text-primary-600 dark:text-primary-500 text-sm font-medium">View all</a>
</div>

<Table divClass="relative overflow-x-auto">
	<TableBody>
		{#each applications as application}
			<TableBodyRow>
				<TableBodyCell class="flex items-center">
					<img src={application.image} alt="" class="mr-4 h-10 w-10 rounded-full" />
					<div>
						<div class="font-semibold">{application.name}</div>
						<div class="text-sm text-gray-500">{application.date}</div>
					</div>
				</TableBodyCell>

				<TableBodyCell class="text-right">
					<Badge rounded large color={application.color}>{application.status}</Badge>
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
