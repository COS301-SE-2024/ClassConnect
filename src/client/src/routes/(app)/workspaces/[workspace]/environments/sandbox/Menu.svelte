<script lang="ts">
	import { page } from '$app/stores';
	import { sineIn } from 'svelte/easing';
	import { HTML } from '@threlte/extras';
	import { getContext, onMount } from 'svelte';
	import {
		BarsOutline,
		ExpandOutline,
		MinimizeOutline,
		ArrowLeftToBracketOutline
	} from 'flowbite-svelte-icons';
	import { Button, CloseButton, Drawer, Hr, Listgroup, ListgroupItem } from 'flowbite-svelte';

	import ViewLocalModelModal from './ViewModal.svelte';
	import { navigateToParentRoute } from '$utils/navigation';

	let isClosed = true;
	let fullscreen = false;
	let canvas: HTMLElement;
	let viewModalOpen = false;

	const transitionParams = { x: -320, duration: 200, easing: sineIn };
	const loadModel = getContext('loadModel') as (modelUrl: string) => void;
	const models = getContext('models') as [
		{ title: string; file_path: string; description: string }
	];

	onMount(() => {
		canvas = document.querySelector('.webgl') as HTMLCanvasElement;
	});

	function toggleFullscreen() {
		if (!document.fullscreenElement) {
			if (canvas.requestFullscreen) canvas.requestFullscreen();

			fullscreen = true;
		} else {
			if (document.exitFullscreen) document.exitFullscreen();

			fullscreen = false;
		}
	}
</script>

<HTML>
	<Button
		on:click={() => (isClosed = false)}
		color="dark"
		class="m-4 rounded-md border border-gray-300 bg-transparent bg-opacity-30 p-1 backdrop-blur-md dark:border-gray-700"
	>
		<BarsOutline size="xl" />
	</Button>

	<Drawer
		{transitionParams}
		transitionType="fly"
		bind:hidden={isClosed}
		class="flex h-full flex-col bg-transparent bg-opacity-30 backdrop-blur-md"
	>
		<div class="flex">
			<h1 class="text-xl font-bold text-white">Menu</h1>

			<CloseButton on:click={() => (isClosed = true)} class="mb-4 text-white" />
		</div>

		<Hr />

		<Listgroup class="bg-transparent bg-opacity-30 backdrop-blur-md">
			<h3 class="p-1 text-center text-xl font-bold text-white">Available Models</h3>

			{#each models as model}
				<ListgroupItem
					class="flex w-full items-center p-2 text-lg text-white transition-colors hover:bg-gray-700"
				>
					<span>{model.title}</span>

					<Button on:click={() => loadModel(model.file_path)} color="light" class="ml-auto p-2">
						Load
					</Button>
				</ListgroupItem>
			{/each}
		</Listgroup>

		<Hr />

		<Button on:click={() => (viewModalOpen = true)} color="light">View Your Own Model</Button>

		<Button on:click={() => navigateToParentRoute($page.url.pathname)} color="dark" class="mt-auto">
			Exit<ArrowLeftToBracketOutline />
		</Button>
	</Drawer>

	<div class="fixed bottom-4 right-4">
		<Button
			on:click={toggleFullscreen}
			color="dark"
			class="m-4 rounded-md border border-gray-300 bg-transparent bg-opacity-30 p-1 backdrop-blur-md dark:border-gray-700"
		>
			{#if fullscreen}
				<MinimizeOutline size="xl" />
			{:else}
				<ExpandOutline size="xl" />
			{/if}
		</Button>
	</div>

	<ViewLocalModelModal bind:open={viewModalOpen} />
</HTML>
