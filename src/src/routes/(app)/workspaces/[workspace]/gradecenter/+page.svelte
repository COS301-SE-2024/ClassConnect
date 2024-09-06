<script lang="ts">
	import { Input } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableHead,
		TableBodyRow,
		TableBodyCell,
		TableHeadCell
	} from 'flowbite-svelte';

	import LineChart from '$lib/components/grades/LineChart.svelte';

	export let data: any;

	let searchTerm = '';
	let { students, assessments, stats } = data;

	$: filteredStudents = students.filter((student: any) =>
		student.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	function getColorClass(grade: number) {
		if (grade < 39) return 'bg-red-200 dark:bg-red-900';
		if (grade < 69) return 'bg-yellow-200 dark:bg-yellow-900';

		return 'bg-green-200 dark:bg-green-900';
	}
</script>

<div class="container mx-auto p-4">
	<h1 class="mb-4 text-2xl font-bold dark:text-white">Grade Center</h1>

	<section class="mb-2">
		{#if data.stats.length === 0}
			<p class="text-lg dark:text-white">No data available</p>
		{:else}
			<div class="mt-8">
				<LineChart {stats} />
			</div>
		{/if}
	</section>

	<section>
		{#if students.length === 0}
			<p class="text-lg dark:text-white">No grades available</p>
		{:else}
			<Input type="text" placeholder="Search student" bind:value={searchTerm} class="mb-4 w-1/4" />

			<Table striped={true}>
				<TableHead>
					<TableHeadCell>Name</TableHeadCell>
					<TableHeadCell>Student No.</TableHeadCell>
					{#each assessments as assessment}
						<TableHeadCell>{assessment}</TableHeadCell>
					{/each}
				</TableHead>

				<TableBody>
					{#each filteredStudents as student}
						<TableBodyRow>
							<TableBodyCell>{student.name}</TableBodyCell>

							<TableBodyCell>{student.username}</TableBodyCell>

							{#each student.grades as grade}
								<TableBodyCell class={getColorClass(grade)}>
									{grade}%
								</TableBodyCell>
							{/each}
						</TableBodyRow>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</section>
</div>
