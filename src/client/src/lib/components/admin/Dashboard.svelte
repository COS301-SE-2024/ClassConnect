<script>
	import { Card } from 'flowbite-svelte';

	export let data;
	$: ({ students, lecturers, workspaces } = data);
</script>

<main>
	<h1 class="mb-4 text-3xl font-bold dark:text-white">Dashboard</h1>

	<div class="grid grid-cols-1 gap-4 md:grid-cols-3">
		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Total Students
			</h5>
			<p class="text-4xl font-normal leading-tight text-gray-700 dark:text-gray-400">
				{students}
			</p>
		</Card>

		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Total Lecturers
			</h5>
			<p class="text-4xl font-normal leading-tight text-gray-700 dark:text-gray-400">
				{lecturers}
			</p>
		</Card>

		<Card>
			<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
				Total Workspaces
			</h5>
			<p class="text-4xl font-normal leading-tight text-gray-700 dark:text-gray-400">
				{workspaces}
			</p>
		</Card>
	</div>
</main>
