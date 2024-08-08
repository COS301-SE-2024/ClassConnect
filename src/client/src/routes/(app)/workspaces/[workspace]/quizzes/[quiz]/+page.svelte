<script lang="ts">
	//[quiz].page.svelte
	import { Progressbar, Button, Radio, Card } from 'flowbite-svelte';
	import Form from '$lib/components/questions/Form.svelte';
	import { enhance } from '$app/forms';
	import Submission from '$lib/components/modals/quizzes/Submission.svelte';
	import { browser } from '$app/environment';
	import { onMount, onDestroy } from 'svelte';
	import { page } from '$app/stores';
	import { writingQuiz } from '$lib/store/sidebar';
	import { goto } from '$app/navigation';

	export let data: any;
	const workspaceID = data.workspaceID;
	let elapsed = 0;
	let isFormOpen = false;
	let activeTimer = false;
	let isPreview = false;
	let isPreview = false;
	let submissionResult: any = null;

	$: ({ questions, role, duration } = data);
	$: activeTimer = role === 'student' && !isPreview;
	$: isPreview = $page.url.searchParams.get('preview') === 'true';
	$: activeTimer = role === 'student' && !isPreview;
	$: isPreview = $page.url.searchParams.get('preview') === 'true';

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
		if (browser) {
			if (activeTimer) {
				last_time = performance.now();
				update();
				writingQuiz.set(true);
			}

			// Add this new block for monitoring writingQuiz
			const unsubscribe = writingQuiz.subscribe((value) => {
				console.log('writingQuiz value:', value);
			});

			// Return a cleanup function
			return () => {
				unsubscribe();
				if (frame) {
					cancelAnimationFrame(frame);
				}
			};
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

	async function handleQuizSubmission() {
		try {
			stopTimer();
			writingQuiz.set(false);
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
			writingQuiz.set(false);
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

	function handleFormSubmit() {
		isFormOpen = false;
		goto(`/workspaces/${workspaceID}/quizzes`);
	}
</script>

<main class="container mx-auto my-8 px-4">
	<h1 class="mb-4 text-2xl font-bold">Quiz Questions</h1>
	{#if role === 'student' || (role === 'lecturer' && isPreview)}
	{#if role === 'student' || (role === 'lecturer' && isPreview)}
		{#if questions.length === 0}
			<p class="text-gray-700 dark:text-gray-300">No questions available for this quiz.</p>
		{:else}
			{#if role === 'student' && !isPreview}
				<p class="text-gray-700 dark:text-gray-300">Elapsed time to complete quiz:</p>
				<Progressbar
					progress={100 * (1 - elapsed / duration)}
					size="h-4"
					color={elapsed / duration > 0.75 ? 'red' : elapsed / duration > 0.5 ? 'yellow' : 'green'}
				/>
				<div>{(elapsed / 1000).toFixed(1)}s</div>
			{/if}
			{#if role === 'student' && !isPreview}
				<p class="text-gray-700 dark:text-gray-300">Elapsed time to complete quiz:</p>
				<Progressbar
					progress={100 * (1 - elapsed / duration)}
					size="h-4"
					color={elapsed / duration > 0.75 ? 'red' : elapsed / duration > 0.5 ? 'yellow' : 'green'}
				/>
				<div>{(elapsed / 1000).toFixed(1)}s</div>
			{/if}
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
			</div>
			{#if role === 'student' && !isPreview}
			</div>
			{#if role === 'student' && !isPreview}
				<form
					method="POST"
					action="?/submitQuiz"
					use:enhance={() => {
						return async ({ result }) => {
							if (result.type === 'success') {
								submissionResult = result.data;
							} else {
								submissionResult = { success: false, error: 'Failed to submit quiz' };
							}
							submissionMessage = submissionResult.success
								? submissionResult.message || 'Quiz submitted successfully'
								: submissionResult.error || 'An error occurred';
							submitModalOpen = true;
						};
					}}
				>
					<input type="hidden" name="mark" value={totalPoints} />
					<Button type="submit" on:click={handleQuizSubmission}>Submit Quiz</Button>
				</form>
			{/if}
		{/if}
	{:else if role === 'lecturer' && !isPreview}
		<Form bind:open={isFormOpen} on:formSubmitted={handleFormSubmit} />
	{:else}
		<p class="text-gray-700 dark:text-gray-300">You do not have permission to view this content.</p>
	{/if}
</main>
<Submission bind:open={submitModalOpen} {submissionMessage} {totalPoints} />
