<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';

	let selectedObject =
		'https://class-connect-file-storage.s3.amazonaws.com/objects/66a0f01ef4736bcf3a73c7d0.glb';

	export let materials;

	function handleObjectChange(event: Event) {
		selectedObject = (event.target as HTMLSelectElement).value;
	}
</script>

<div
	class="relative h-full w-full overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600"
>
	<div class="object-selector">
		<label for="object-select">Select 3D Object:</label>
		<select id="object-select" bind:value={selectedObject} on:change={handleObjectChange}>
			{#each materials as material}
				{#if material.type === true}
					<option value={material.file_path}>{material.title}</option>
				{/if}
			{/each}
		</select>
	</div>

	<Canvas>
		<Scene {selectedObject} />
	</Canvas>
</div>

<style>
	.object-selector {
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 1000;
		background-color: rgba(255, 255, 255, 0.8);
		padding: 10px;
		border-radius: 5px;
	}
</style>
