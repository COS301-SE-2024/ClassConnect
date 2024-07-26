<script lang="ts">
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { sineIn } from 'svelte/easing';
	import { HTML } from '@threlte/extras';
	import { BarsOutline, ArrowLeftToBracketOutline } from 'flowbite-svelte-icons';
	import { Button, CloseButton, Drawer, Listgroup, ListgroupItem } from 'flowbite-svelte';

	import { navigateToParentRoute } from '$utils/navigation';

	let isClosed = true;

	const transitionParams = { x: -320, duration: 200, easing: sineIn };

	const models = getContext('models') as [{ name: string; url: string }];
	const loadModel = getContext('loadModel') as (modelUrl: string) => void;
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

			<CloseButton on:click={() => (isClosed = false)} class="mb-4 text-white" />
		</div>

		<Listgroup class="bg-transparent bg-opacity-30 backdrop-blur-md">
			<h3 class="p-1 text-center text-xl font-bold text-white">Available Models</h3>

			{#each models as model}
				<ListgroupItem
					class="flex w-full items-center p-2 text-lg text-white transition-colors hover:bg-gray-700"
				>
					<span>{model.name}</span>

					<Button on:click={() => loadModel(model.url)} color="light" class="ml-auto p-2">
						Load
					</Button>
				</ListgroupItem>
			{/each}
		</Listgroup>

		<Button on:click={() => navigateToParentRoute($page.url.pathname)} color="dark" class="mt-auto">
			Exit<ArrowLeftToBracketOutline />
		</Button>
	</Drawer>
</HTML>
