<script lang="ts">
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Card,
		Button,
		Avatar
	} from 'flowbite-svelte';
	import {
		ChartPieOutline,
		CalendarEditOutline,
		BookOpenOutline,
		UsersOutline
	} from 'flowbite-svelte-icons';

	// Mock data remains the same
	const stats = [
		{ title: 'Total Topics', value: 5, icon: BookOpenOutline },
		{ title: 'Total Students', value: 120, icon: UsersOutline },
		{ title: 'Upcoming Lectures', value: 3, icon: CalendarEditOutline },
		{ title: 'Avg. Attendance', value: '85%', icon: ChartPieOutline }
	];
	const upcomingLectures = [
		{ course: 'Introduction to Computer Science', date: '2024-07-05 10:00 AM', room: 'CS-101' },
		{ course: 'Data Structures', date: '2024-07-06 2:00 PM', room: 'CS-202' },
		{ course: 'Algorithms', date: '2024-07-07 11:00 AM', room: 'CS-303' }
	];
	const recentSubmissions = [
		{ student: 'John Doe', course: 'Intro to CS', assignment: 'Homework 1', date: '2024-07-03' },
		{
			student: 'Jane Smith',
			course: 'Data Structures',
			assignment: 'Project 2',
			date: '2024-07-02'
		},
		{ student: 'Bob Johnson', course: 'Algorithms', assignment: 'Quiz 3', date: '2024-07-01' }
	];
</script>

<div class="bg-gray-50 p-4 dark:bg-gray-900">
	<h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Lecturer Dashboard</h1>

	<!-- Stats Overview -->
	<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
		{#each stats as stat}
			<Card>
				<div class="flex items-center">
					<div
						class="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-200"
					>
						<svelte:component this={stat.icon} class="h-6 w-6" />
					</div>
					<div class="ml-4">
						<p class="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
						<p class="text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
					</div>
				</div>
			</Card>
		{/each}
	</div>

	<!-- Upcoming Lectures - Full Width -->
	<Card class="mb-8 w-full">
		<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Upcoming Lectures</h2>
		<Table>
			<TableHead>
				<TableHeadCell>Course</TableHeadCell>
				<TableHeadCell>Date & Time</TableHeadCell>
				<TableHeadCell>Room</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each upcomingLectures as lecture}
					<TableBodyRow>
						<TableBodyCell>{lecture.course}</TableBodyCell>
						<TableBodyCell>{lecture.date}</TableBodyCell>
						<TableBodyCell>{lecture.room}</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</Card>

	<!-- Recent Submissions - Full Width -->
	<Card class="w-full">
		<h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">Recent Student Submissions</h2>
		<Table>
			<TableHead>
				<TableHeadCell>Student</TableHeadCell>
				<TableHeadCell>Course</TableHeadCell>
				<TableHeadCell>Assignment</TableHeadCell>
				<TableHeadCell>Date</TableHeadCell>
				<TableHeadCell>Action</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each recentSubmissions as submission}
					<TableBodyRow>
						<TableBodyCell>
							<div class="flex items-center">
								<Avatar size="xs" class="mr-2" />
								{submission.student}
							</div>
						</TableBodyCell>
						<TableBodyCell>{submission.course}</TableBodyCell>
						<TableBodyCell>{submission.assignment}</TableBodyCell>
						<TableBodyCell>{submission.date}</TableBodyCell>
						<TableBodyCell>
							<Button size="xs">Review</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</Card>
</div>
