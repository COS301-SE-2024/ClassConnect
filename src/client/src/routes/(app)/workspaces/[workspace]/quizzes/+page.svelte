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
    
	import {  EditOutline, TrashBinOutline } from 'flowbite-svelte-icons';
	import AddModal from '$lib/components/modals/quizzes/Add.svelte';
	import EditModal from '$lib/components/modals/quizzes/Edit.svelte';
	import RemoveModal from '$lib/components/modals/Delete.svelte';
	import Question from '$lib/components/quizzes/Form.svelte';


	
	export let data: any;

	let id: string;
    // let data: Quiz[] = [];
    let isQuizFormOpen= false;
	let isEditModalOpen = false;
	let isAddModalOpen= false;
	let isRemoveModalOpen=false;

	let selectedQuestionType = '';
	

	$: ({ quizzes } = data);
	//console.log(data);
	const headers = ['Title', 'Graded', 'Date Modified', 'Actions'];

	function handleEditModalOpen(quizID: string) {
		id = quizID;
		isEditModalOpen = true;
	}

	function handleAddModalOpen(quizID: string) {
		id = quizID;
		isAddModalOpen = true;
	}

	function handleRemoveModalOpen(quizId: string) {
		id = quizId;
		isRemoveModalOpen=true;
	}

	function handleQuestionTypeSelect(event: CustomEvent<{ type: string }>) {
		selectedQuestionType = event.detail.type;
		isQuizFormOpen = true;
  }
	
</script>
<main class="container mx-auto my-2 px-4">
	{#if quizzes.length === 0}
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				No quizzes available in this workspace.
			</h1>
			<Button on:click={() => (isQuizFormOpen = true)}>Add Quiz</Button>
		</div>
	{:else}
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Quizzes</h2>
					<span class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400">
						{quizzes.length} {quizzes.length === 1 ? 'quiz' : 'quizzes'}
					</span>
				</div>
			</div>
			<div class="mb-4 flex items-center gap-x-3">
				<Button on:click={() => (isQuizFormOpen = true)}>Add Quiz</Button>
			</div>
		</div>

		<Table class="my-2">
			<TableHead>
				{#each headers as header}
					<TableHeadCell>{header}</TableHeadCell>
				{/each}
			</TableHead>

			<TableBody tableBodyClass="divide-y">
				{#each quizzes as quiz (quiz.id)}
					<TableBodyRow>
						<TableBodyCell>{quiz.title}</TableBodyCell>
						<TableBodyCell>{quiz.graded }</TableBodyCell>
						<TableBodyCell>{quiz.date}</TableBodyCell>
						<TableBodyCell>
							<div class="flex items-center gap-x-6">
								{#if quiz.graded==='No'}
									<Button on:click={() => handleEditModalOpen(quiz.id)}>
										<EditOutline />
									</Button>
								{/if}
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

<AddModal bind:open={isQuizFormOpen} />
<EditModal bind:open={isEditModalOpen} on:select={handleQuestionTypeSelect} />
{#if selectedQuestionType === 'multiple-choice'}
<Question bind:open={isRemoveModalOpen} />
{/if}
<RemoveModal bind:open={isRemoveModalOpen} {id} item="quiz" />
