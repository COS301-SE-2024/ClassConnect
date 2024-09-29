<script lang="ts">
	// import { Button } from 'flowbite-svelte';
	import ContentAddition from '$src/lib/components/interactive/ContentAddition.svelte';
	import MCQ from '$lib/components/forms/interactive/MCQ.svelte';
	import Note from '$lib/components/forms/interactive/Notes.svelte';
	import ThreeDMaterial from '$lib/components/forms/interactive/ThreeDMaterial.svelte';
	// import type { DndEvent } from 'svelte-dnd-action';
	import { onMount } from 'svelte';
	// import { dndzone } from 'svelte-dnd-action';
	import Mover from '$lib/components/forms/interactive/viewers/Mover.svelte';

	export let data: any;
	$: ({ role, interactive, materials, threeDMaterials } = data);

	let content: any[] = [];
	$: content = interactive.content;

	onMount(async () => {
		content = interactive.content;
	});

	// function handleDndConsider(e: CustomEvent<DndEvent>) {
	// 	content = e.detail.items;
	// }

	// function handleDndFinalize(e: CustomEvent<DndEvent>) {
	// 	content = e.detail.items;
	// }

	// let dropStyle = {
	// 	outline: '2px dashed',
	// 	borderColor: '#057a55'
	// };
</script>

<main class="container mx-auto p-4">
	<div class="flex justify-center p-4 md:px-5 md:py-7">
		<h2 class="text-center text-3xl font-bold text-gray-800 dark:text-white">
			Interactive Lesson: {interactive.title}
		</h2>
	</div>

	{#if role == 'lecturer'}
		{#if content.length === 0}
			<ContentAddition materials={threeDMaterials} />
		{:else}
			<div>
				{#each content as item (item.id)}
					<div
						class="my-4 rounded-2xl border-2 border-dashed border-green-600 bg-white p-4 shadow-lg"
					>
						{#if item.type == 'MCQ'}
							<MCQ question={item} />
						{:else if item.type == 'Note'}
							<Note {materials} note={item} />
						{:else if item.type == 'ThreeDMaterial'}
							<ThreeDMaterial materials={threeDMaterials} threeDMaterial={item} />
						{/if}
					</div>
				{/each}
			</div>
			<ContentAddition materials={threeDMaterials} />
		{/if}
	{:else}
		<Mover {content} />
	{/if}
</main>

<!-- cursor-move
use:dndzone={{ items: content, dropTargetStyle: dropStyle, flipDurationMs: 300 }}
on:consider={handleDndConsider}
on:finalize={handleDndFinalize} -->
