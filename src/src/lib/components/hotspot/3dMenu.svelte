<script lang="ts">
	import { Button, Drawer, Hr, Listgroup, ListgroupItem, CloseButton } from 'flowbite-svelte';
	import { BarsOutline } from 'flowbite-svelte-icons';
	import { sineIn } from 'svelte/easing';

	export let models: { title: string; file_path: string; description: string }[];
	export let onModelSelect: (file_path: string) => void;

	let isClosed = true;

	const transitionParams = { x: -320, duration: 200, easing: sineIn };

	function handleModelSelect(file_path: string) {
		onModelSelect(file_path);
	}
</script>

<!-- Menu Button to Open Drawer -->
<Button
	on:click={() => (isClosed = false)}
	color="dark"
	class="m-4 rounded-md border border-gray-300 bg-blue-700 bg-opacity-70 p-1 backdrop-blur-md dark:border-gray-700"
>
	<BarsOutline size="xl" />
</Button>

<!-- Drawer for Menu -->
<Drawer
	{transitionParams}
	transitionType="fly"
	bind:hidden={isClosed}
	class="flex h-full flex-col bg-transparent bg-opacity-30 backdrop-blur-md"
>
	<div class="flex items-center justify-between">
		<h1 class="text-xl font-bold text-white">Menu</h1>
		<CloseButton on:click={() => (isClosed = true)} class="mb-4 text-white" />
	</div>

	<Hr />

	<!-- Models List -->
	<Listgroup class="bg-transparent bg-opacity-30 backdrop-blur-md">
		<h3 class="p-1 text-center text-xl font-bold text-white">Available Models</h3>
		{#each models as model}
			<ListgroupItem
				class="flex w-full items-center p-2 text-lg text-white transition-colors hover:bg-gray-700"
			>
				<span>{model.title}</span>
				<Button
					on:click={() => handleModelSelect(model.file_path)}
					color="light"
					class="ml-auto p-2"
				>
					Load
				</Button>
			</ListgroupItem>
		{/each}
	</Listgroup>

	<Hr />
</Drawer>
