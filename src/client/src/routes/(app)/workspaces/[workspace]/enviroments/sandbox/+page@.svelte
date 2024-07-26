<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { useProgress } from '@threlte/extras';
	import Scene from './Scene.svelte';

	const { progress } = useProgress();
	const tweenedProgress = tweened($progress, { duration: 800 });
	$: tweenedProgress.set($progress);
</script>

{#if $tweenedProgress < 1}
	<div
		class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white text-black"
		transition:fade|local={{ duration: 200 }}
	>
		<p class="text-sm">Loading</p>
		<div class="relative h-2.5 w-1/3 border border-black">
			<div class="absolute h-full bg-green-500" style="width: {$tweenedProgress * 100}%" />
		</div>
	</div>
{/if}

<main class="h-screen bg-black">
	<Canvas>
		<Scene />
	</Canvas>
</main>
