<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';

	let selectedObject = 'box';

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
			<option value="box">Box</option>
			<option value="sphere">Sphere</option>
			<option value="cone">Cone</option>
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
