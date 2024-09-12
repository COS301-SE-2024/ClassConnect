<script lang="ts">
	//quizzes.page.svelte
	import {
		Table,
		Button,
		TableBody,
		TableHead,
		TableBodyRow,
		TableHeadCell,
		TableBodyCell
	} from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	import AddModal from '$lib/components/modals/quizzes/Add.svelte';
	import EditModal from '$lib/components/modals/quizzes/Edit.svelte';
	import RemoveModal from '$lib/components/modals/Delete.svelte';
	import { selectedQuestionTypeStore } from '$lib/store/questions';
	import Question from '$lib/components/questions/Form.svelte';
	

	export let data: any;
	console.log(data);

	let id: string;
	let isQuizFormOpen = false;
	let is3DOpen=false;
	let isEditModalOpen = false;
	let isAddQuiz = false;

	let isRemoveModalOpen = false;

	let selectedQuestionType = '';

	function openQuiz(quizID: string) {
		const workspaceId = data.workspaceID;
		console.log('Workspace ID:', workspaceId);
		if (workspaceId) {
			goto(`/workspaces/${workspaceId}/quizzes/${quizID}?preview=false`);
		} else {
			console.error('Workspace ID is missing or undefined');
		}
	}

	const headers = ['Title', 'Graded', 'Date Modified', 'Duration (in minutes)', 'Actions'];
	$: ({ quizzes } = data);

	function handleEditModalOpen(quizID: string) {
		id = quizID;
		isEditModalOpen=true;
	}

	function handleAddModalOpen(quizID: string) {
		id = quizID;
		//isAddModalOpen = true;
	}

	function handle3dHotspot(){
		is3DOpen=true;
	}

	function handleRemoveModalOpen(quizId: string) {
		id = quizId;
		isRemoveModalOpen = true;
	}

	function handlePreview(quizId: string) {
		id = quizId;
		const workspaceId = data.workspaceID;
		if (workspaceId) {
			goto(`/workspaces/${workspaceId}/quizzes/${quizId}?preview=true`);
		} else {
			console.error('Workspace ID is missing or undefined');
		}
	}

	function handleQuestionTypeSelect(event: CustomEvent<{ type: string }>) {
		// isQuizFormOpen = true;
		console.log('Type selected in event:', event.detail.type);
		selectedQuestionTypeStore.set(event.detail.type);
		openQuiz(id);
	}
</script>

<main class="container mx-auto my-2 px-4">
	{#if quizzes.length === 0}
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-semibold text-gray-700 dark:text-white">
				No quizzes available in this workspace.
			</h1>
			{#if data.role === 'lecturer'}
				<Button on:click={() => (isAddQuiz = true)}>Add Quiz</Button>
			{/if}
		</div>
	{:else}
		<div class="sm:flex sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-x-3">
					<h2 class="text-xl font-bold text-gray-800 dark:text-white">Quizzes</h2>
					<span
						class="rounded-full bg-green-100 px-3 py-1 text-xs text-green-600 dark:bg-gray-800 dark:text-green-400"
					>
						{quizzes.length}
						{quizzes.length === 1 ? 'quiz' : 'quizzes'}
					</span>
				</div>
			</div>

			<div class="mb-4 flex items-center gap-x-3">
				{#if data.role === 'lecturer'}
					<Button on:click={() => (isAddQuiz = true)}>Add Quiz</Button>
				{/if}
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
					{#if data.role === 'student' || data.role === 'lecturer'}
						<TableBodyRow>
							<TableBodyCell>{quiz.title}</TableBodyCell>
							<TableBodyCell>{quiz.graded}</TableBodyCell>
							<TableBodyCell>{quiz.date}</TableBodyCell>
							<TableBodyCell>{quiz.duration / (60 * 1000)}</TableBodyCell>

							<TableBodyCell>
								<div class="flex items-center gap-x-6">
									{#if data.role === 'lecturer'}
										{#if quiz.graded === 'No'}
											<Button o on:click={() => handleEditModalOpen(quiz.id)}>Edit</Button>
										{/if}
										<Button color="yellow" on:click={() => handlePreview(quiz.id)}>Preview</Button>
										<Button color="red" on:click={() => handleRemoveModalOpen(quiz.id)}>
											Delete
										</Button>
									{:else if data.role === 'student'}
										<Button on:click={() => openQuiz(quiz.id)}>Start</Button>
									{/if}
								</div>
							</TableBodyCell>
						</TableBodyRow>
					{/if}
				{/each}
			</TableBody>
		</Table>
	{/if}
</main>

<AddModal bind:open={isAddQuiz} />
<EditModal bind:open={isEditModalOpen} on:select={handleQuestionTypeSelect} />

<RemoveModal bind:open={isRemoveModalOpen} {id} item="quiz" />
