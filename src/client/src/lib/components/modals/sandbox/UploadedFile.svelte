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
	import { displayedSandboxObjectURL } from '$src/lib/store/objects';
    
    export let open: boolean;
    export let items : any;

	let objectSearchTerm = '';

	$: filteredItems = items.filter(
        (item: any) => item.title.toLowerCase().indexOf(objectSearchTerm.toLowerCase()) !== -1
	);

	function handleObjectSelect(items: any) {
		displayedSandboxObjectURL.set(items.fileURL);
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