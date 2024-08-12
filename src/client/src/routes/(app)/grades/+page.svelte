<script lang="ts">
	import {
		Tabs,
		Table,
		TabItem,
		TableBody,
		TableHead,
		TableBodyRow,
		TableBodyCell,
		TableHeadCell
	} from 'flowbite-svelte';

	export let data: any;

	let workspaces = data.workspaces;
</script>

<main class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold dark:text-white">Student Grades</h1>

	<Tabs style="underline">
		{#each workspaces as workspace}
			<TabItem open title={workspace.name}>
				<Table striped={true}>
					<TableHead>
						<TableHeadCell>Assessment</TableHeadCell>
						<TableHeadCell>Date & Time</TableHeadCell>
						<TableHeadCell>Your Score (%)</TableHeadCell>
						<TableHeadCell>Class Average (%)</TableHeadCell>
					</TableHead>

					<TableBody>
						{#each workspace.grades as grade}
							<TableBodyRow>
								<TableBodyCell>{grade.assessment}</TableBodyCell>
								<TableBodyCell>{grade.date}</TableBodyCell>
								<TableBodyCell>{grade.score}</TableBodyCell>
								<TableBodyCell>{grade.average}</TableBodyCell>
							</TableBodyRow>
						{/each}
					</TableBody>
				</Table>
			</TabItem>
		{/each}
	</Tabs>
</main>
