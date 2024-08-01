<script lang="ts">
	import {
		Tabs,
		TabItem,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	// Sample data - replace with actual data fetching logic
	const modules = [
		{
			name: 'Maths',
			grades: [
				{ assessment: 'Midterm Exam', date: '2024-03-15 14:30', score: 85, average: 78 },
				{ assessment: 'Final Project', date: '2024-05-20 23:59', score: 92, average: 84 }
			]
		},
		{
			name: 'English',
			grades: [
				{ assessment: 'Essay 1', date: '2024-02-10 12:00', score: 78, average: 75 },
				{ assessment: 'Presentation', date: '2024-04-05 10:15', score: 88, average: 82 }
			]
		},
		{
			name: 'History',
			grades: [
				{ assessment: 'Research Paper', date: '2024-03-01 23:59', score: 90, average: 79 },
				{ assessment: 'Final Exam', date: '2024-05-25 09:00', score: 85, average: 81 }
			]
		}
	];

	// Calculate total items - this resolves the "unused variable" issue
	const totalItems = modules.reduce((sum, module) => sum + module.grades.length, 0);

	// Function to format date
	function formatDate(dateString: string | number | Date) {
		const date = new Date(dateString);
		return date.toLocaleString();
	}
</script>

<main class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">Student Grades</h1>
	<p class="mb-4">Total number of assessments: {totalItems}</p>

	<Tabs style="underline">
		{#each modules as module}
			<TabItem open title={module.name}>
				<Table striped={true}>
					<TableHead>
						<TableHeadCell>Assessment</TableHeadCell>
						<TableHeadCell>Date & Time</TableHeadCell>
						<TableHeadCell>Your Score (%)</TableHeadCell>
						<TableHeadCell>Class Average (%)</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each module.grades as grade}
							<TableBodyRow>
								<TableBodyCell>{grade.assessment}</TableBodyCell>
								<TableBodyCell>{formatDate(grade.date)}</TableBodyCell>
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
