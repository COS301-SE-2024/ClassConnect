<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Input, Textarea, NumberInput, Label, Select } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';
	import { selectedModel } from '$lib/store/model';

	export let open: boolean;
	export let materials: any[];

	const dispatch = createEventDispatcher();
	let error: string;
	let modelPath: string;
	let selected: string = '';

	modelPath = $selectedModel;
	console.log('Model Path in close', modelPath);

	function close() {
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				open = false;
				dispatch('formSubmitted');
			} else {
				error = result.data?.error;
			}
		};
	}
</script>

<main class="container mx-auto my-4 px-4">
	<h1 class="mb-4 text-2xl font-bold">Create a New Question</h1>

	<form method="POST" action="?/post3D" class="flex flex-col" use:enhance={close}>
		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<div class="mb-4">
			<Label for="questionNumber">Question Number</Label>
			<Input
				id="questionNumber"
				name="questionNumber"
				type="text"
				placeholder="Enter question number"
				required
			/>
		</div>

		<div class="mb-4">
			<Label class="mb-4 space-y-2">
				<span>Points</span>
				<NumberInput name="points" />
			</Label>
		</div>
		
		<Label>
			Select a 3D object:
			<Select class="my-2" bind:value={selected}>
				{#each materials as option}
					<option value={option.file_path}>{option.title}</option>
				{/each}
			</Select>
		</Label>
		
		<div class="mb-4">
			<Label for="questionContent">Question Content</Label>
			<Textarea
				id="questionContent"
				name="questionContent"
				rows="8"
				placeholder="Write the question content"
				required
			/>
		</div>

		<div class="mb-4">
			<slot name="scene" />
		</div>

		<input type="hidden" name="modelPath" value={selected} />
		<Button type="submit" class="mt-10 w-full">Submit Question</Button>
	</form>
</main>
