<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$lib/components/envirmonment/+Scene.svelte';
	import ObjectSettings from '$lib/components/envirmonment/models/+ObjectSettings.svelte';
	import { Button } from 'flowbite-svelte';
	import { CirclePlusOutline, CloseCircleOutline } from 'flowbite-svelte-icons';

	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let enableZoom: boolean = true;
</script>

<main class="p-4">
	<div class="flex flex-col space-y-4">
		<header class="flex items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
			<h1 class="text-2xl font-semibold dark:text-gray-200">Sandbox</h1>
			<div class="flex space-x-2">
				<Button class="flex items-center space-x-1">
					<CirclePlusOutline class="h-5 w-5" />
					<span>Add Item</span>
				</Button>
				<Button color="red" class="flex items-center space-x-1">
					<CloseCircleOutline class="h-5 w-5" />
					<span>Remove Item</span>
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
			<ObjectSettings
				bind:enableDamping
				bind:autoRotate
				bind:rotateSpeed
				bind:zoomToCursor
				bind:zoomSpeed
				bind:enableZoom
			/>
		</section>
	</div>
</main>
