<script lang="ts">
	import {
		Modal,
		TableSearch,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { displayedSandboxObjectURL, ObjInScene } from '$src/lib/store/objects';

	export let open: boolean;
	export let items: any;

	let objectSearchTerm = '';

	function fuzzySearch(text: string, search: string): boolean {
		search = search.toLowerCase();
		text = text.toLowerCase();
		let searchIndex = 0;
		for (let i = 0; i < text.length && searchIndex < search.length; i++) {
			if (text[i] === search[searchIndex]) {
				searchIndex++;
			}
		}
		return searchIndex === search.length;
	}

	$: filteredItems = items.filter(
		(item: any) =>
			fuzzySearch(item.title, objectSearchTerm) || fuzzySearch(item.description, objectSearchTerm)
	);

	function handleObjectSelect(items: any) {
		displayedSandboxObjectURL.set(items.file_path);
		ObjInScene.set(true);
		open = false;
	}
</script>

<Modal bind:open size="lg" autoclose={false} class="w-full">
	<TableSearch
		class="my-2"
		placeholder="Pick a 3D Object"
		hoverable={true}
		bind:inputValue={objectSearchTerm}
	>
		<TableHead>
			<!-- <TableHeadCell>ID</TableHeadCell> -->
			<TableHeadCell>Object</TableHeadCell>
			<TableHeadCell>Description</TableHeadCell>
		</TableHead>

		<TableBody tableBodyClass="divide-y">
			{#each filteredItems as item}
				<TableBodyRow on:click={() => handleObjectSelect(item)} class="cursor-pointer">
					<!-- <TableBodyCell>{item.id}</TableBodyCell> -->

					<TableBodyCell>{item.title}</TableBodyCell>

					<TableBodyCell>{item.description}</TableBodyCell>
				</TableBodyRow>
			{/each}
		</TableBody>
	</TableSearch>
</Modal>
