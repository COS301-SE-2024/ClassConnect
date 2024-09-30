<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from './Scene.svelte';
	import { onMount } from 'svelte';
	import { useProgress } from '@threlte/extras';
	import { derived } from 'svelte/store';

	let selectedObject = '';
	export let role: string;
	export let materials: { type: boolean; file_path: string; title: string }[] = [];

	function handleObjectChange(event: Event) {
		selectedObject = (event.target as HTMLSelectElement).value;
	}

	onMount(() => {
		if (materials.length > 0) {
			selectedObject = materials.find((material) => material.type === true)?.file_path || '';
		}
	});

	// Use the `useProgress` hook to track loading state
	const { progress } = useProgress();

	// A derived store to track if the loading is complete
	const isLoading = derived(progress, ($progress) => $progress < 1);
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

	{#if $isLoading}
		<div class="loading-overlay">
			Loading 3D model... {$progress * 100}%
		</div>
	{/if}

	<Canvas>
		<Scene {selectedObject} {role} />
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

	.loading-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: rgba(0, 0, 0, 0.5);
		color: white;
		font-size: 1.5rem;
		z-index: 2000;
	}
</style>
