<script lang="ts">
	import ObjectSettings from '$src/lib/components/sandbox/models/+ObjectSettings.svelte';
	import AddToScene from '$src/lib/components/modals/sandbox/AddToScene.svelte';
	import Scene from '$src/lib/components/sandbox/+Scene.svelte';
	import { Canvas } from '@threlte/core';

	import { CirclePlusOutline, CloseCircleOutline } from 'flowbite-svelte-icons';
	import { displayedSandboxObjectURL } from '$src/lib/store/objects';
	import { Button } from 'flowbite-svelte';
	import { items } from './items';

	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let enableZoom: boolean = true;

	let experimentModal = false;

	async function handleRemoveObject(event : Event) {
        event.preventDefault();
        displayedSandboxObjectURL.set('');
		experimentModal = false;
	}
</script>

<main class="p-4">
	<div class="flex flex-col space-y-4">
		<header class="flex items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
			<h1 class="text-2xl font-semibold dark:text-gray-200">Sandbox</h1>
			<div class="flex space-x-2">
				<Button
					on:click={() => (experimentModal = true)}
					color="green"
					class="flex items-center  space-x-1"
				>
					<CirclePlusOutline class="h-5 w-5" />
					<span>Add To Scene</span>
				</Button>
				<AddToScene open={experimentModal} items={items} on:close={() => experimentModal = false}/>
				<Button color="red" class="flex items-center space-x-1" on:click={handleRemoveObject}>
					<CloseCircleOutline class="h-5 w-5" />
					<span>Remove From Scene</span>
				</Button>
			</div>
		</header>
		<section
			class="flex h-[700px] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
		>
			<div class="flex-1">
				<Canvas>
					<Scene
						{enableDamping}
						{autoRotate}
						{rotateSpeed}
						{zoomToCursor}
						{zoomSpeed}
						{enableZoom}
					/>
				</Canvas>
			</div>
			{#if $displayedSandboxObjectURL !== ''}
				<ObjectSettings
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