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

	import CancelModal from '$src/lib/components/modals/lessons/Cancel.svelte';

	export let role: string;
	export let lessons: any[];

	let id: string;
	let isCancelModalOpen = false;

	const headers = ['Topic', 'Description', 'Date', 'Time'];
</script>

{#if lessons.length > 0}
	<p class="text-l font-bold text-gray-800 dark:text-white">In Session</p>

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
						<Button class="mr-2" size="sm" on:click={() => goto($page.url + '/' + lesson.id)}>
							Join
						</Button>

						{#if role === 'lecturer'}
							<Button
								size="sm"
								color="red"
								on:click={() => {
									id = lesson.id;
									isCancelModalOpen = true;
								}}
							>
								Cancel
							</Button>
						{/if}
					</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</Table>
{/if}

<CancelModal bind:open={isCancelModalOpen} {id} />
