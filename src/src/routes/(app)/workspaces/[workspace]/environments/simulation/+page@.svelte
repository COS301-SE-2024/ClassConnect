<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { useProgress } from '@threlte/extras';
	import {World} from '@threlte/rapier'
    import {setContext} from 'svelte';
	import Menu from '$lib/components/sandbox/c_environment/Scene_Assets/Menu_2.svelte';

	import StarterScene from '$src/lib/components/sandbox/c_environment/StaterScene_2.svelte';
	import MiningStage from '$src/lib/components/sandbox/c_environment/Scene_2.svelte';


	const { progress } = useProgress();
	const tweenedProgress = tweened($progress, { duration: 800 });
	 let stagePicked : boolean = false;

	function selectStage () {
		stagePicked = !stagePicked;
		console.log("STAGE PICKED?: ", stagePicked)
	}
    
	setContext('selectStage', selectStage);
	setContext('stagePicked', stagePicked);


	$: tweenedProgress.set($progress);
</script>
<!-- Pelica -->
{#if $tweenedProgress < 1}
	<div
		transition:fade|local={{ duration: 200 }}
		class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-white text-black"
	>
		<p class="text-sm">Loading</p>

		<div class="relative h-2.5 w-1/3 border border-black">
			<div class="absolute h-full bg-green-500" style="width: {$tweenedProgress * 100}%" />
		</div>
	</div>
{/if}

<main class="webgl h-screen bg-black">
{#if stagePicked}
<Canvas>
	<!-- <Menu/> -->
	<World>
		<MiningStage />
	</World>
</Canvas>

{:else}
<Canvas>
	<StarterScene />
</Canvas>

{/if}
</main>
