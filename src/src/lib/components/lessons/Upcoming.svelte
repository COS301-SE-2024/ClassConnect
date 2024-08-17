<script lang="ts">
	import {
		Table,
		Button,
		TableBody,
		TableHead,
		TableBodyRow,
		TableBodyCell,
		TableHeadCell
	} from 'flowbite-svelte';

	import EditModal from '$src/lib/components/modals/lessons/Edit.svelte';
	import CancelModal from '$src/lib/components/modals/lessons/Cancel.svelte';

	export let role: string;
	export let lessons: any[];

	let id: string;
	let isEditModalOpen = false;
	let isCancelModalOpen = false;

	const headers = ['Topic', 'Description', 'Date', 'Time'];
</script>

{#if lessons.length > 0}
	<p class="text-l font-bold text-gray-800 dark:text-white">Upcoming</p>
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
						{#if role === 'lecturer'}
							<Button
								class="mr-2"
								size="sm"
								on:click={() => {
									id = lesson.id;
									isEditModalOpen = true;
								}}
							>
								Edit
							</Button>

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

<EditModal bind:open={isEditModalOpen} {id} />
<CancelModal bind:open={isCancelModalOpen} {id} />
