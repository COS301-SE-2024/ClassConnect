<script lang="ts">
	import { Input, Label, Button, Textarea, Modal, Select } from 'flowbite-svelte';
	import {
		ExclamationCircleOutline,
		TrashBinOutline,
		CirclePlusOutline,
		ArchiveArrowDownOutline
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	export let question: any;

	let error: string;
	let open = false;
	let id: string;
	let answer: string;

	function save() {
		const toastId = toast.loading('Saving question...');
		return async ({ result }: any) => {
			if (result.type === 'success') {
				toast.dismiss(toastId);
				toast.success('Saved successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Failed to save question!: ' + error);
			}
		};
	}

	function remove() {
		const toastId = toast.loading('Deleting question...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Deleted successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Deletion Failed!: ' + error);
			}
		};
	}

	function addOption() {
		options = [...options, { option: 'New option', isCorrect: false }];
		question = { ...question, options };
	}

	function removeOption(index: number) {
		options = options.filter((_, i) => i !== index);
		question = { ...question, options };
		if (answer === options[index].option) {
			answer = '';
		}
	}

	$: options = question.options;

	onMount(() => {
		console.log(question);
		id = question.id;
		answer = question.answer;
	});
</script>

<Toaster />

<main class="container mx-auto p-4">
	<div class="p-2 md:px-5 md:py-2">
		<form method="POST" action="?/editContent" use:enhance={save}>
			<div class="grid grid-cols-12 gap-6">
				<div class="col-span-10">
					<div>
						<Label for="question-{question.id}" class="mb-2 text-2xl"
							>Multiple Choice Question</Label
						>
						<Textarea
							id="question-{question.id}"
							rows="2"
							name="question"
							placeholder={question.question}
							bind:value={question.question}
						/>
						<Label for="description-{question.id}" class="m-2">Description</Label>
						<Textarea
							id="description-{question.id}"
							rows="2"
							name="description"
							placeholder={question.description}
							bind:value={question.description}
						/>
						<div class="mt-4">
							{#each options as option, i}
								<Label for="option-{question.id}-{i}" class="mb-2">Option {i + 1}</Label>
								<div class="mb-6 grid grid-cols-12 gap-6">
									<div class="col-span-11">
										<Textarea
											type="text"
											id="option-{question.id}-{i}"
											name="options"
											placeholder={option}
											class="mb-2 w-full"
											bind:value={option}
										/>
									</div>
									<div class="col-span-1">
										<Button
											on:click={() => removeOption(i)}
											class="border-none bg-transparent hover:bg-transparent focus:ring-0"
										>
											<TrashBinOutline
												class="text-gray-500 transition-colors duration-200 hover:text-red-500"
											/>
											<span class="sr-only">Remove Option</span>
										</Button>
									</div>
								</div>
							{/each}
						</div>
						<Label>
							Select an answer:
							<Select class="m-2" bind:value={answer}>
								{#each question.options as option}
									<option value={option}>{option}</option>
								{/each}
							</Select>
						</Label>
						<Input type="hidden" id="answer" name="answer" value={answer} />
						<Input type="hidden" id="id" name="id" value={id} />
					</div>
				</div>
				<div class="col-span-2">
					<div
						class="w-48 justify-center rounded-lg border border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
					>
						<div
							class="relative inline-flex w-full items-center justify-center rounded-t-lg border-b border-gray-200 px-4 py-2 text-sm font-medium focus:z-10 focus:text-green-700 focus:ring-2 focus:ring-green-700 dark:border-gray-600 dark:focus:text-white dark:focus:ring-gray-500"
						>
							Actions
						</div>
						<button
							type="button"
							on:click={() => addOption()}
							class="relative inline-flex w-full items-center border-b border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-green-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							<CirclePlusOutline class="mr-2 text-gray-500" />
							Add Option
						</button>
						<button
							type="button"
							on:click={() => (open = true)}
							class="hover:text-red-700dark:border-gray-600 relative inline-flex w-full items-center border-b border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-red-700 dark:hover:bg-gray-600"
						>
							<TrashBinOutline
								class="mr-2 text-gray-500 transition-colors duration-200 hover:text-red-500"
							/>
							Remove Question
						</button>
						<button
							type="submit"
							class="relative inline-flex w-full items-center rounded-b-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-green-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
						>
							<ArchiveArrowDownOutline class="mr-2 text-gray-500" />
							Save Question
						</button>
					</div>
				</div>
			</div>
		</form>
	</div>
</main>

<Modal bind:open size="xs" class="text-center">
	<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		Are you sure you want to delete this question?
	</h3>

	{#if error}
		<p class="mt-2 text-center text-red-500">{error}</p>
	{/if}

	<form method="POST" action="?/deleteContent" use:enhance={remove}>
		<Input type="hidden" id="id" name="id" value={id} />
		<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
	</form>
</Modal>
