<script lang="ts">
	import { Progressbar, Button, Radio, Card } from 'flowbite-svelte';
	import Form from '$lib/components/questions/Form.svelte';
	import Submission from '$lib/components/modals/quizzes/Submission.svelte';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';

	export let data: any;
	let elapsed = 0;
	let isFormOpen = false;
	let activeTimer = false;

	function toggleForm() {
		isFormOpen = !isFormOpen;
	}

	$: ({ questions, role, duration } = data);
	$: activeTimer = role === 'student';

	let last_time: number;
	let frame: number;

	function update() {
		if (activeTimer) {
			frame = requestAnimationFrame(update);
			const time = performance.now();
			elapsed += Math.min(time - last_time, duration - elapsed);
			last_time = time;
			if (elapsed >= duration) {
				cancelAnimationFrame(frame);
				handleTimeOutSubmission();
			}
		}
	}

	function stopTimer() {
		if (browser && frame) {
			cancelAnimationFrame(frame);
			activeTimer = false;
		}
	}

	onMount(() => {
		if (browser && activeTimer) {
			last_time = performance.now();
			update();
		}
	});

	onDestroy(() => {
		if (browser && frame && activeTimer) {
			cancelAnimationFrame(frame);
		}
	});
	let selectedAnswers: { [key: string]: string } = {};
	let submitModalOpen = false;
	let submissionMessage = '';
	let totalPoints = 0;

	function handleSelection(questionId: string, optionContent: string) {
		selectedAnswers[questionId] = optionContent;
	}

	function handleQuizSubmission() {
		try {
			stopTimer();
			totalPoints = questions.reduce((total: number, question: any) => {
				const selectedOption = question.options.find(
					(option: any) => option.content === selectedAnswers[question.questionNumber]
				);
				return total + (selectedOption ? selectedOption.points : 0);
			}, 0);
			submissionMessage = `You have successfully submitted the quiz. Your score is ${totalPoints} points.`;
			submitModalOpen = true;
		} catch (error) {
			console.error('Error in handleQuizSubmission:', error);
		}
	}

	function handleTimeOutSubmission() {
		try {
			// Calculate points as in handleQuizSubmission
			totalPoints = questions.reduce((total: number, question: any) => {
				const selectedOption = question.options.find(
					(option: any) => option.content === selectedAnswers[question.questionNumber]
				);
				return total + (selectedOption ? selectedOption.points : 0);
			}, 0);
			submissionMessage = `Your time has run out for the quiz submission. Your score is ${totalPoints} points.`;
			submitModalOpen = true;
		} catch (error) {
			console.error('Error in handleTimeOutSubmission:', error);
		}
	}
</script>

<main class="container mx-auto my-8 px-4">
	<h1 class="mb-4 text-2xl font-bold">Quiz Questions</h1>
	{#if role === 'student'}
		{#if questions.length === 0}
			<p class="text-gray-700 dark:text-gray-300">No questions available for this quiz.</p>
		{:else}
			<p class="text-gray-700 dark:text-gray-300">Elapsed time to complete quiz:</p>
			<Progressbar
				progress={100 * (1 - elapsed / duration)}
				size="h-4"
				color={elapsed / duration > 0.75 ? 'red' : elapsed / duration > 0.5 ? 'yellow' : 'green'}
			/>

			<div>{(elapsed / 1000).toFixed(1)}s</div>
			<div class="space-y-6">
				{#each questions as question (question.id)}
					<Card>
						<h2 class="mb-2 text-xl font-bold">Question {question.questionNumber}</h2>
						<p class="mb-4 text-base font-normal text-gray-700 dark:text-gray-400">
							{question.questionContent}
						</p>
						<div class="space-y-2">
							{#each question.options as option}
								<Radio
									name={question.questionNumber}
									value={option.content}
									checked={selectedAnswers[question.questionNumber] === option.content}
									on:change={() => handleSelection(question.questionNumber, option.content)}
								>
									{option.content}
								</Radio>
							{/each}
						</div>
					</Card>
				{/each}
				<Button type="submit" on:click={handleQuizSubmission}>Submit Quiz</Button>
			</div>
		{/if}
	{:else if role === 'lecturer'}
		<Form bind:open={isFormOpen} />
		{#if !isFormOpen}
			<Button on:click={toggleForm} class="mt-4">Create New Question</Button>
		{/if}
	{:else}
		<p class="text-gray-700 dark:text-gray-300">You do not have permission to view this content.</p>
	{/if}
</main>

<Submission bind:open={submitModalOpen} {submissionMessage} {totalPoints} />
