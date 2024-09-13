<script lang="ts">
	import { Radio, Card, Heading, P } from 'flowbite-svelte';

	export let questions: any[] = [];
	console.log('Q', questions);
	export let selectedAnswers: { [key: string]: string } = {};
	export let handleSelection: (questionId: string, optionContent: string) => void;
</script>

<div class="space-y-8">
	{#each questions as question (question.id)}
		<Card
			size="none"
			padding="xl"
			class="bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl dark:bg-gray-800"
		>
			<Heading tag="h2" class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
				Question {question.questionNumber}
			</Heading>

			{#if question.questionType==='3d-hotspot'}
				<P class="mb-6 font-semibold text-blue-800">
					Tip: Drag the sphere to the desired position. Check all perspectives to ensure proper intersection with the model.
				</P>
			{/if}

			<P class="mb-6 text-lg text-gray-700 dark:text-gray-300">
				{question.questionContent}
			</P>
			<div class="space-y-4">
				{#if question.options && question.options.length > 0}
					{#each question.options as option}
						<Radio
							class="text-lg"
							name={question.questionNumber}
							value={option.content}
							checked={selectedAnswers[question.questionNumber] === option.content}
							on:change={() => handleSelection(question.questionNumber, option.content)}
						>
							{option.content}
						</Radio>
					{/each}
				{:else}
					<slot name="scene" />
				{/if}
			</div>
		</Card>
	{/each}
</div>
