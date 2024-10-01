<script lang="ts">
	import {
		Table,
		TableBody,
		TableHead,
		TableBodyRow,
		TableBodyCell,
		TableHeadCell
	} from 'flowbite-svelte';

	export let data: any;

	$: ({ grades } = data);
</script>

<main class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold dark:text-white">Grades</h1>
	{#if grades.length === 0}
		<p class="text-lg dark:text-white">No grades available</p>
	{:else}
		<Table striped={true}>
			<TableHead>
				<TableHeadCell>Assessment</TableHeadCell>
				<TableHeadCell>Date & Time</TableHeadCell>
				<TableHeadCell>Your Score (%)</TableHeadCell>
				<TableHeadCell>Class Average (%)</TableHeadCell>
			</TableHead>

			<TableBody>
				{#each grades as grade}
					<TableBodyRow>
						<TableBodyCell>{grade.assessment}</TableBodyCell>
						<TableBodyCell>{grade.date}</TableBodyCell>
						<TableBodyCell>{grade.score}</TableBodyCell>
						<TableBodyCell>{grade.average}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</main>
