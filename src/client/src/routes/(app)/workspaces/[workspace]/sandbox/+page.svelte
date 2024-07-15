<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$src/lib/components/sandbox/+Scene.svelte';
	import ObjectSettings from '$src/lib/components/sandbox/models/+ObjectSettings.svelte';

	import { Button, Modal, Label, Input, Fileupload, TableSearch, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox } from 'flowbite-svelte';
	import { CirclePlusOutline, CloseCircleOutline, WandMagicSparklesOutline, ArrowUpFromBracketOutline, } from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';
	import {items} from "./items"
	import { displayedSandboxObjectURL } from '$src/lib/store/objects';

	

	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let enableZoom: boolean = true;
	let objectSearchTerm = '';

	$: filteredItems = items.filter((item) => item.title.toLowerCase().indexOf(objectSearchTerm.toLowerCase()) !== -1);

	let experimentModal = false;

	function handleObjectSelect(items:any) {
	displayedSandboxObjectURL.set(items.fileURL);
	experimentModal = false;
	
}
</script>

<main class="p-4">
	<div class="flex flex-col space-y-4">
		<header class="flex items-center justify-between rounded-lg bg-gray-100 p-4 dark:bg-gray-700">
			<h1 class="text-2xl font-semibold dark:text-gray-200">Sandbox</h1>
			<div class="flex space-x-2">




				<Button on:click={() => (experimentModal = true)} color='green' class="flex items-center  space-x-1">
					<CirclePlusOutline class="h-5 w-5" />
					<span>Add To Scene</span>
				</Button>
				<!-- Modal Menu -->
				<Modal bind:open={experimentModal} size="xs" autoclose={false} class="w-full">


		
	<TableSearch class="my-2"  placeholder='Pick a 3D Object' hoverable={true} bind:inputValue={objectSearchTerm}>
		<TableHead>
				<TableHeadCell>ID</TableHeadCell>
				<TableHeadCell>Object</TableHeadCell>
				<TableHeadCell>Description</TableHeadCell>

		</TableHead>

		<TableBody tableBodyClass="divide-y">
			{#each filteredItems as item}
			<TableBodyRow on:click={() => handleObjectSelect(item)} class="cursor-pointer">

					<TableBodyCell>{item.id}</TableBodyCell>

					<TableBodyCell>{item.title}</TableBodyCell>

					<TableBodyCell>{item.description}</TableBodyCell>

				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>

				</Modal>

				<Button color="red" class="flex items-center space-x-1">
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