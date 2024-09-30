<script lang="ts">
	import { page } from '$app/stores';
	import { sineIn } from 'svelte/easing';
	import { HTML } from '@threlte/extras';
	import { getContext } from 'svelte';
	import { BarsOutline, ArrowLeftToBracketOutline } from 'flowbite-svelte-icons';
	import { Button, CloseButton, Drawer, Hr, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { displayedSandboxObjectURL } from '$src/lib/store/objects';

	import { navigateToParentRoute } from '$utils/navigation';

	let isClosed = true;

	const transitionParams = { x: -320, duration: 200, easing: sineIn };
	const selectStage = getContext('selectStage') as () => void;
	let stagePicked = getContext('stagePicked');
	let workspaceFound = getContext('workspaceFound') as boolean;

	function exit() {
		displayedSandboxObjectURL.set('');
		navigateToParentRoute($page.url.pathname);
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
			<h1 class="text-xl font-bold text-white">Stage Menu</h1>

			<CloseButton on:click={() => (isClosed = true)} class="mb-4 text-white" />
		</div>
		{#if !stagePicked && workspaceFound}
			<Hr />

			<Listgroup class="bg-transparent bg-opacity-30 backdrop-blur-md">
				<h3 class="p-1 text-center text-xl font-bold text-white">Available Stages</h3>

				<ListgroupItem
					class="flex w-full items-center p-2 text-lg text-white transition-colors hover:bg-gray-700"
				>
					<span>Mining</span>

					<Button on:click={() => selectStage()} color="light" class="ml-auto p-2">Load</Button>
				</ListgroupItem>
			</Listgroup>

			<Hr />
		{:else}
			<Hr />

			<Listgroup class="bg-transparent bg-opacity-30 backdrop-blur-md">
				<h3 class="p-1 text-center text-xl font-bold text-white">Available Stages</h3>

				<ListgroupItem
					class="flex w-full items-center p-2 text-lg text-white transition-colors hover:bg-gray-700"
				>
					<span>No Stages Avaialble</span>
				</ListgroupItem>
			</Listgroup>

			<Hr />
		{/if}

		<Button on:click={exit} color="dark" class="mt-auto">
			Exit<ArrowLeftToBracketOutline />
		</Button>
	</Drawer>
</HTML>
