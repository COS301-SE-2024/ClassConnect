<script lang="ts">
	import { onMount } from 'svelte';
	import { Input, Label, Button, Select } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { enhance } from '$app/forms';

	export let content: any[] = [];
	let currItem: any;
	let currIndex = 0;
	let error: string;
	let selected: any;
	let id: string;

	onMount(async () => {
		currItem = content[0];
		console.log(content);
	});

	function moveForward() {
		if (currIndex < content.length - 1) {
			currIndex++;
			currItem = content[currIndex];
		}
	}

	function moveBackward() {
		if (currIndex > 0) {
			currIndex--;
			currItem = content[currIndex];
		}
	}

	function checkanswer() {
		if (selected == currItem.answer) {
			toast.success('Correct Answer');
		} else {
			toast.error('Wrong Answer');
		}
	}

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

	$: currItem = content[currIndex];
	$: stepsAhead = Math.min(3, content.length - currIndex);
	$: options = currItem.options;
</script>

<Toaster />

<div class="space-y-4">
	<div class="flex flex-col items-center gap-4 sm:grid sm:grid-cols-12">
		<!-- Previous Button -->
		<div class="w-full sm:col-span-1 sm:flex sm:justify-start">
			<button
				class="w-full rounded-lg bg-green-600 px-4 py-2 text-white sm:w-auto"
				on:click={moveBackward}
				disabled={currIndex === 0}
			>
				Previous
			</button>
		</div>

		<!-- Stepper Navigation in the Center -->
		<div
			class="w-full rounded-2xl border-2 bg-white p-4 shadow-lg sm:col-span-10 sm:flex sm:justify-center"
		>
			<!-- Stepper -->
			<div data-hs-stepper="" class="w-full">
				<!-- Stepper Nav -->
				<ul class="mb-4 flex w-full items-center justify-center">
					{#each Array(stepsAhead) as _, i}
						<li class="flex flex-1 items-center last:flex-none">
							<div class="flex flex-1 items-center">
								<span class="flex items-center text-xs sm:text-sm">
									<span
										class={`mr-2 flex size-6 flex-shrink-0 items-center justify-center rounded-full font-medium sm:size-8
										${i === 0 ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-800'}`}
									>
										{currIndex + i + 1}
									</span>
									<span class="hidden sm:inline">{content[currIndex + i].title ?? 'Question'}</span>
								</span>
								<!-- this was done to make the linter stop failing -->
								<span class="hidden">
									{_}
								</span>
								{#if i < stepsAhead - 1}
									<div class="mx-2 h-px w-full bg-gray-200"></div>
								{/if}
							</div>
						</li>
					{/each}
				</ul>
				<!-- End Stepper Nav -->
			</div>
			<!-- End Stepper -->
		</div>

		<!-- Next Button -->
		<div class="w-full sm:col-span-1 sm:flex sm:justify-end">
			<button
				class="w-full rounded-lg bg-green-600 px-4 py-2 text-white sm:w-auto"
				on:click={moveForward}
				disabled={currIndex === content.length - 1}
			>
				Next
			</button>
		</div>
	</div>

	<!-- Content Centered Below -->
	<div class="flex justify-center">
		<div class="w-full px-4 sm:px-0">
			{#if currItem.type == 'MCQ'}
				<main class="container mx-auto p-4 sm:w-[100vw]">
					<div class="p-2 md:px-5 md:py-2">
						<form method="POST" action="?/answerMCQ" use:enhance={save}>
							<div class="grid grid-cols-12 gap-6">
								<div class="col-span-10">
									<div>
										<p class="m-2 text-center text-3xl">
											{currItem.question}
										</p>
										<p class="m-2 text-center text-xl text-gray-500">
											{currItem.description}
										</p>
										<div class="mt-4">
											{#each options as option, i}
												<p class="mb-2">Option {i + 1}</p>
												<div class="mb-6 grid grid-cols-12 gap-6">
													<div class="col-span-11">
														<p
															id="option-{currItem.id}-{i}"
															placeholder={option}
															class="mb-2 w-full"
														>
															{option}
														</p>
													</div>
												</div>
											{/each}
										</div>
										<Label>
											Select an answer:
											<Select class="m-2" bind:value={selected}>
												{#each currItem.options as option}
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
			{:else if currItem.type == 'Note'}
				<main class="container mx-auto px-2 py-4 sm:px-4 md:px-6 lg:px-8">
					<div class="mx-auto w-full max-w-4xl">
						<div class="flex flex-col items-center">
							<div class="mb-4 w-full">
								<h2 class="text-center text-xl font-semibold sm:text-2xl md:text-3xl">
									{currItem.title}
								</h2>
							</div>
							<div class="w-full">
								<div class="p-2 sm:p-3">
									<section
										class="flex flex-col space-y-2 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
									>
										<div class="w-full flex-1">
											<iframe
												id="google-pdf-viewer"
												class="h-[50vh] w-full sm:h-[60vh] md:h-[70vh] lg:h-[80vh]"
												src={currItem.content}
												frameborder="0"
												title="Study Material"
											></iframe>
										</div>
									</section>
								</div>
							</div>
						</div>
					</div>
				</main>
			{:else if currItem.type == 'ThreeDMaterial'}
				<main class="container mx-auto p-4 sm:w-[100vw]">
					<div class="p-2 md:px-5 md:py-2">
						<div class="grid grid-cols-12 justify-center gap-6 text-center">
							<div class="col-span-10">
								<div class="mb-6">
									<h2 class="mb-2 text-2xl">
										{currItem.title}
									</h2>
								</div>
								<div>
									<div class="flex justify-center p-3">
										<section
											class="flex h-[100%] w-[100%] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
										>
											<div class="flex-1">
												<!-- Use it like any other HTML element -->
												<model-viewer
													class="h-[100vh] w-full flex-grow"
													alt={currItem.description}
													src={currItem.link}
													ar
													environment-image="/moon_1k.hdr"
													poster="/poster.svg"
													shadow-intensity="1"
													camera-controls
													touch-action="pan-y"
												>
												</model-viewer>
											</div>
										</section>
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			{/if}
		</div>
	</div>
</div>
