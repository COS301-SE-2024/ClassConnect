<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { tweened } from 'svelte/motion';
	import { fade } from 'svelte/transition';
	import { useProgress } from '@threlte/extras';
	import { World } from '@threlte/rapier';
	import { setContext } from 'svelte';

	import StarterScene from '$src/lib/components/sandbox/c_environment/StaterScene_2.svelte';
	import MiningStage from '$src/lib/components/sandbox/c_environment/Scene_2.svelte';

	const { progress } = useProgress();
	const tweenedProgress = tweened($progress, { duration: 800 });

	export let data: any;

	let workspaceFound = data.success;

	let stagePicked: boolean = false;

	function selectStage() {
		stagePicked = !stagePicked;
	}

	setContext('selectStage', selectStage);
	setContext('stagePicked', stagePicked);
	setContext('workspaceFound', workspaceFound);

	$: tweenedProgress.set($progress);
</script>

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

{#if stagePicked}
	<div class="webgl h-screen w-screen bg-black">
		<Canvas>
			<!-- <Menu/> -->
			<World>
				<MiningStage />
			</World>
		</Canvas>
	</div>
{:else}
	<div class="webgl h-screen bg-black">
		<Canvas>
			<StarterScene />
		</Canvas>
	</div>
{/if}
