<script lang="ts">
	import { Input, Label, Button, Select } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	export let question: any;

	let error: string;
	let selected: any;
	let id: string;

	function save() {
		const toastId = toast.loading('Answering question...');
		return async ({ result }: any) => {
			if (result.type === 'success') {
				toast.dismiss(toastId);
				toast.success('Answered correctlly');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error(error);
			}
		};
	}

	function checkanswer() {
		if (selected == question.answer) {
			toast.success('Correct Answer');
		} else {
			toast.error('Wrong Answer');
		}
	}

	$: options = question.options;

	onMount(() => {
		console.log(question);
		id = question.id;
	});
</script>

<Toaster />

<main class="container mx-auto p-4">
	<div class="p-2 md:px-5 md:py-2">
		<form method="POST" action="?/answerMCQ" use:enhance={save}>
			<div class="grid grid-cols-12 gap-6">
				<div class="col-span-10">
					<div>
						<p class="m-2 text-center text-3xl">
							{question.question}
						</p>
						<p class="m-2 text-center text-xl text-gray-500">
							{question.description}
						</p>
						<div class="mt-4">
							{#each options as option, i}
								<p class="mb-2">Option {i + 1}</p>
								<div class="mb-6 grid grid-cols-12 gap-6">
									<div class="col-span-11">
										<p id="option-{question.id}-{i}" placeholder={option} class="mb-2 w-full">
											{option}
										</p>
									</div>
								</div>
							{/each}
						</div>
						<Label>
							Select an answer:
							<Select class="m-2" bind:value={selected}>
								{#each question.options as option}
									<option value={option}>{option}</option>
								{/each}
							</Select>
						</Label>
						<Input type="hidden" id="answer" name="answer" value={selected} />
						<Input type="hidden" id="id" name="id" value={id} />
						<Button type="button" on:click={checkanswer} class="mt-4 w-full">Answer</Button>
					</div>
				</div>
			</div>
		</form>
	</div>
</main>
