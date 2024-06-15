<script lang="ts">
	import { goto } from '$app/navigation';
	import { lessons } from '$lib/stores/store';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Breadcrumb,
		BreadcrumbItem,
		Button
	} from 'flowbite-svelte';

	import ScheduleLesson from '$lib/components/modals/+ScheduleLesson.svelte';

	const headers = ['Topic', 'Date', 'Time'];
</script>

<section class="container mx-auto my-2 px-4">
	<div class="flex items-center overflow-x-auto whitespace-nowrap py-4">
		<Breadcrumb aria-label="Default breadcrumb example">
			<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
			<BreadcrumbItem href="/lessons">Lessons</BreadcrumbItem>
		</Breadcrumb>
	</div>

	<div class="sm:flex sm:items-center sm:justify-between">
		<div>
			<div class="flex items-center gap-x-3">
				<h2 class="text-xl font-bold text-gray-800 dark:text-white">Lessons</h2>

				<span
					class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
				>
					{$lessons.length + 1}
					{' '} lessons
				</span>
			</div>
		</div>
		<div class="mb-4 flex items-center gap-x-3">
			<ScheduleLesson />
		</div>
	</div>

	<br />

	<p class="text-l font-bold text-gray-800 dark:text-white">In Session</p>

	<Table class="my-2">
		<TableHead>
			{#each headers as header}
				<TableHeadCell>{header}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			<TableBodyRow>
				<TableBodyCell class="inline-flex items-center gap-x-3">
					<p class="text-lg text-gray-800 dark:text-white">Mathematics</p>
				</TableBodyCell>
				<TableBodyCell>15 June</TableBodyCell>
				<TableBodyCell>09:30</TableBodyCell>
				<TableBodyCell>
					<Button size="xs" on:click={() => goto('lessons/1234')}>Join</Button>
				</TableBodyCell>
			</TableBodyRow>
		</TableBody>
	</Table>

	<br />

	<p class="text-l font-bold text-gray-800 dark:text-white">Upcoming</p>

	<Table class="my-2">
		<TableHead>
			{#each headers as header}
				<TableHeadCell>{header}</TableHeadCell>
			{/each}
		</TableHead>
		<TableBody tableBodyClass="divide-y">
			{#each $lessons as lesson}
				<TableBodyRow>
					<TableBodyCell class="inline-flex items-center gap-x-3">
						<p class="text-lg text-gray-800 dark:text-white">
							{lesson.topic}
						</p>
					</TableBodyCell>
					<TableBodyCell>
						{lesson.date}
					</TableBodyCell>
					<TableBodyCell>
						{lesson.time}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
</section>
