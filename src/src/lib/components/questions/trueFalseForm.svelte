<script lang="ts">
	import { enhance } from '$app/forms';
	import { Button, Input, Textarea, NumberInput, Label, Radio } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	export let open: boolean;
	const dispatch = createEventDispatcher();
	let error: string;

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

	<form method="POST" action="?/postTF" class="flex flex-col" use:enhance={close}>
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

		<div class=" mb-4">
			<Label for="correctAnswer">Set Correct Answer</Label>
			<div class="grid grid-cols-2 gap-6">
				<div class="rounded border border-gray-200 dark:border-gray-700">
					<Radio id="correctAnswer" name="correctAnswer" value="true" class="w-full p-4">True</Radio
					>
				</div>
				<div class="rounded border border-gray-200 dark:border-gray-700">
					<Radio id="correctAnswer" name="correctAnswer" value="false" class="w-full p-4"
						>False</Radio
					>
				</div>
			</div>
		</div>

		<div class="mb-4">
			<slot name="scene" />
		</div>

		<Button type="submit" class="mt-10 w-full">Submit Question</Button>
	</form>
</main>
