<script lang="ts">
	import {
		Table,
		Button,
		
		TableBody,
		TableHead,
		TableBodyRow,
		TableHeadCell,
		TableBodyCell
	} from 'flowbite-svelte';
    import { onMount } from 'svelte';
	import {  EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';

    let data :any;
    let isAddModalOpen= false;
	onMount(() => {
		data = [
			{ id: 1, title: 'Quiz 1', graded: true, dateModified: new Date('2023-07-01') },
			{ id: 2, title: 'Quiz 2', graded: false, dateModified: new Date('2023-07-10') },
			{ id: 3, title: 'Quiz 3', graded: true, dateModified: new Date('2023-07-15') }
		];
	});

	const headers = ['Title', 'Graded', 'Date Modified', 'Actions'];

	function handleEditModalOpen(quizId: string) {
		
		console.log(`Edit quiz with ID: ${quizId}`);
	}

	function handleRemoveModalOpen(quizId: string) {
		
		console.log(`Remove quiz with ID: ${quizId}`);
	}
	
</script>
<main class="container mx-auto my-2 px-4">
	{#if data.length === 0}
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				No quizzes available in this workspace.
			</h1>
			<Button on:click={() => (isAddModalOpen = true)}>Add Quiz</Button>
		</div>
	{:else}
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Quizzes</h2>
					<span class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400">
						{data.length} {data.length === 1 ? 'quiz' : 'quizzes'}
					</span>
				</div>
			</div>
			<div class="mb-4 flex items-center gap-x-3">
				<Button on:click={() => (isAddModalOpen = true)}>Add Quiz</Button>
			</div>
		</div>

		<Table class="my-2">
			<TableHead>
				{#each headers as header}
					<TableHeadCell>{header}</TableHeadCell>
				{/each}
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each data as quiz (quiz.id)}
					<TableBodyRow>
						<TableBodyCell>{quiz.title}</TableBodyCell>
						<TableBodyCell>{quiz.graded ? 'Yes' : 'No'}</TableBodyCell>
						<TableBodyCell>{quiz.dateModified.toLocaleDateString()}</TableBodyCell>
						<TableBodyCell>
							<div class="flex items-center gap-x-6">
								<Button on:click={() => handleEditModalOpen(quiz.id)}>
									<EditOutline />
								</Button>
								<Button color="red" on:click={() => handleRemoveModalOpen(quiz.id)}>
									<TrashBinOutline />
								</Button>
							</div>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	{/if}
</main>
