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
		} else {
			currIndex = 0;
			currItem = content[currIndex];
		}
	}

	function moveBackward() {
		if (currIndex > 0) {
			currIndex--;
			currItem = content[currIndex];
		} else {
			currIndex = content.length - 1;
			currItem = content[currIndex];
		}
	}

	$: currItem = content[currIndex];
</script>

<div>
	<div>
		<div class="my-4 rounded-2xl border-2 border-dashed border-green-600 bg-white p-4 shadow-lg">
			<div class="flex justify-between">
				<button class="rounded-lg bg-green-600 px-4 py-2 text-white" on:click={moveBackward}>
					Previous
				</button>
				<button class="rounded-lg bg-green-600 px-4 py-2 text-white" on:click={moveForward}>
					Next
				</button>
			</div>
		</div>
	</div>

	<div>
		{#if currItem.type == 'MCQ'}
			<MCQ question={currItem} />
		{:else if currItem.type == 'Note'}
			<Note note={currItem} />
		{:else if currItem.type == 'ThreeDMaterial'}
			<ThreeDMaterial material={currItem} />
		{/if}
	</div>
</div>
