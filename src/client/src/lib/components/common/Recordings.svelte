<script lang="ts">
	import {
		Table,
		Button,
		TableBody,
		TableHead,
		TableBodyCell,
		TableBodyRow,
		TableHeadCell
	} from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	export let role: string;
	export let lessons: any = [];

	let id: string;

	const headers = ['Topic', 'Description', 'Date', 'Time'];
</script>

<Table class="my-2">
	<TableHead>
		{#each headers as header}
			<TableHeadCell>{header}</TableHeadCell>
		{/each}
	</TableHead>

	<TableBody tableBodyClass="divide-y">
		{#each lessons as lesson}
			<TableBodyRow>
				<TableBodyCell class="inline-flex items-center gap-x-3">
					<p class="text-lg text-gray-800 dark:text-white">{lesson.topic}</p>
				</TableBodyCell>

				<TableBodyCell>{lesson.description}</TableBodyCell>

				<TableBodyCell>{lesson.date}</TableBodyCell>

				<TableBodyCell>{lesson.time}</TableBodyCell>

				<TableBodyCell>
					<Button
						class="mr-2"
						size="sm"
						on:click={() => goto($page.url + '/video?link=' + lesson.url)}
					>
						Open
					</Button>

					{#if role === 'lecturer'}
						<Button
							size="sm"
							color="primary"
							on:click={() => {
								id = lesson.id;
								console.log('This is the id of the lesson', id);
							}}
						>
							Edit
						</Button>
						<Button
							size="sm"
							color="red"
							on:click={() => {
								id = lesson.id;
								console.log('This is the id of the lesson', id);
							}}
						>
							Delete
						</Button>
					{/if}
				</TableBodyCell>
			</TableBodyRow>
		{/each}
	</TableBody>
</Table>
