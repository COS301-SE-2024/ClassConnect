<script lang="ts">
	import { onMount } from 'svelte';
	import MCQ from '$lib/components/forms/interactive/viewers/MCQ.svelte';
	import Note from '$lib/components/forms/interactive/viewers/Notes.svelte';
	import ThreeDMaterial from '$lib/components/forms/interactive/viewers/ThreeDMaterial.svelte';

	export let content: any[] = [];
	let currItem: any;
	let currIndex = 0;

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

	$: currItem = content[currIndex];
	$: stepsAhead = Math.min(3, content.length - currIndex);
</script>

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
				<MCQ question={currItem} />
			{:else if currItem.type == 'Note'}
				<Note note={currItem} />
			{:else if currItem.type == 'ThreeDMaterial'}
				<ThreeDMaterial material={currItem} />
			{/if}
		</div>
	</div>
</div>
