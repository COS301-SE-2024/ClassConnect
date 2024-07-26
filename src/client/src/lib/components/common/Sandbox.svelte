<script lang="ts">
	import ObjectSettings from '$src/lib/components/sandbox/models/+ObjectSettings.svelte';
	import AddToScene from '$src/lib/components/modals/sandbox/AddToScene.svelte';
	import Scene from '$src/lib/components/sandbox/+Scene.svelte';
	import { Canvas } from '@threlte/core';
	import { CirclePlusOutline, CloseCircleOutline } from 'flowbite-svelte-icons';
	import { displayedSandboxObjectURL } from '$src/lib/store/objects';
	import { Button } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	export let items: any;

	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let enableZoom: boolean = true;
	let fullscreen: boolean = false;
	let experimentModal = false;
	let canvasElement: any;
	let SceneElement: any;

	async function handleRemoveObject(event: Event) {
		event.preventDefault();
		displayedSandboxObjectURL.set('');
		experimentModal = false;
	}

	onMount(() => {
		canvasElement = document.querySelector('.canvas-container');
		console.log(SceneElement); // Example usage
	});

	// Reactive statement to react when SceneElement changes
	$: if (SceneElement) {
		console.log('SceneElement is now defined', SceneElement);
	}
</script>

<main class="p-4">
	<div class="flex flex-col space-y-4">
		<header class="flex items-center justify-between rounded-lg p-4">
			<h1 class="text-2xl font-semibold dark:text-gray-200">Sandbox</h1>
			<div class="flex space-x-2">
				<Button
					on:click={() => (experimentModal = true)}
					color="green"
					class="flex items-center space-x-1"
				>
					<CirclePlusOutline class="h-5 w-5" />
					<span>Add To Scene</span>
				</Button>
				<AddToScene open={experimentModal} {items} on:close={() => (experimentModal = false)} />
				<Button color="red" class="flex items-center space-x-1" on:click={handleRemoveObject}>
					<CloseCircleOutline class="h-5 w-5" />
					<span>Remove From Scene</span>
				</Button>
			</div>
		</header>
		<section
			class="canvas-container flex h-[700px] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
		>
				<Canvas >
					<Scene
						bind:this={SceneElement}
						{enableDamping}
						{autoRotate}
						{rotateSpeed}
						{zoomToCursor}
						{zoomSpeed}
						{enableZoom}
					/>
				</Canvas>

			{#if $displayedSandboxObjectURL !== ''}
				<ObjectSettings
					{SceneElement}
					{canvasElement}
					{fullscreen}
					bind:enableDamping
					bind:autoRotate
					bind:rotateSpeed
					bind:zoomToCursor
					bind:zoomSpeed
					bind:enableZoom
				/>
			{/if}
		</section>
	</div>
</main>

