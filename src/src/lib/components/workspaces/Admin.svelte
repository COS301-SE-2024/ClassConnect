<script lang="ts">
  import { onMount } from 'svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup, ImagePlaceholder, Modal, Radio } from 'flowbite-svelte';
  import { Section } from 'flowbite-svelte-blocks';
  import RemoveModal from '$lib/components/modals/Delete.svelte';
  import AddModal from '$lib/components/modals/workspace/Add.svelte';
  import EditModal from '$lib/components/modals/workspace/Edit.svelte';
  import { PlusOutline, ChevronDownOutline, FilterSolid, ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';

  let divClass='bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
  let innerDivClass='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
  let searchClass='w-full md:w-1/2 relative';
  let svgDivClass='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
  let classInput="text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10";

  export let data;
	let filter = 2;
	$: ({ lecturers, students, workspaces } = data);
  let id: string;
  let searchTerm: string = '';
  let currentPosition: number = 0;
  const itemsPerPage: number = 10;
  const showPage: number = 5;
  let totalPages: number = 0;
  let pagesToShow: number[] = [];
  let totalItems: number = workspaces?.length ?? 0;
  let startPage: number;
  let endPage: number;
  let isAddModalOpen: boolean = false;
  let isEditModalOpen: boolean = false;
  let isRemoveModalOpen: boolean = false;
	let openRow: number | null = null;
  let details: { name: any; }
  let doubleClickModal = false

  const updateDataAndPagination = () => {
    const currentPageItems = workspaces.slice(currentPosition, currentPosition + itemsPerPage);
    renderWorkspaces(currentPageItems.length);
  }

  const loadNextPage = () => {
    if (currentPosition + itemsPerPage < workspaces.length) {
      currentPosition += itemsPerPage;
      updateDataAndPagination();
    }
  }

  const loadPreviousPage = () => {
    if (currentPosition - itemsPerPage >= 0) {
      currentPosition -= itemsPerPage;
      updateDataAndPagination();
    }
  }

  const renderWorkspaces = (totalItems: number) => {
    totalPages = Math.ceil(workspaces.length / itemsPerPage);
    const currentPage = Math.ceil((currentPosition + 1) / itemsPerPage);

    startPage = currentPage - Math.floor(showPage / 2);
    startPage = Math.max(1, startPage);
    endPage = Math.min(startPage + showPage - 1, totalPages);

    pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  const goToPage = (pageNumber: number) => {
    currentPosition = (pageNumber - 1) * itemsPerPage;
    updateDataAndPagination();
  }

  $: startRange = currentPosition + 1;
  $: endRange = Math.min(currentPosition + itemsPerPage, totalItems);

  onMount(() => {
    renderWorkspaces(workspaces.length);
  });

  $: currentPageItems = workspaces.slice(currentPosition, currentPosition + itemsPerPage);
	$: filteredItems = workspaces.filter(
    (workspace: { name: string; owner: string }) =>
      workspace.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workspace.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

	const toggleRow = (id: number) => {
  	openRow = openRow === id ? null : id;
	}

</script>

<Section name="advancedTable" classSection='dark:bg-gray-900 p-3 sm:p-5'>
    <TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm} {divClass} {innerDivClass} {searchClass} {classInput} >

    <div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
      <Button>
        <PlusOutline class="h-3.5 w-3.5 mr-2" />Add
      </Button>
      <Button color='alternative'>Actions<ChevronDownOutline class="w-3 h-3 ml-2 " /></Button>
        <Dropdown class="w-44 divide-y divide-gray-100">
          <DropdownItem>Mass Edit</DropdownItem>
          <DropdownItem>Delete all</DropdownItem>
        </Dropdown>
      <Button color='alternative'>Filter<FilterSolid class="w-3 h-3 ml-2 " /></Button>
        <Dropdown class="w-48 p-3 space-y-2 text-sm">
          <li>
						<Radio name="filter" bind:group={filter} value={1}>Workspace: Ascending</Radio>
          </li>
					<li>
						<Radio name="filter" bind:group={filter} value={1}>Workspace: Descending</Radio>
          </li>
          <li>
            <Radio name="filter" bind:group={filter} value={2}>Lecturers: Ascending</Radio>
          </li>
          <li>
            <Radio name="filter" bind:group={filter} value={3}>Lecturers: Descending</Radio>
          </li>
          <li>
            <Radio name="filter" bind:group={filter} value={4}>Students: Ascending</Radio>
          </li>
          <li>
            <Radio name="filter" bind:group={filter} value={1}>Students: Descending</Radio>
          </li>
        </Dropdown>
    </div>
      <TableHead>
        <TableHeadCell padding="px-4 py-3" scope="col">Workspace</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">No. of Lecturers</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">No. of Students</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Actions</TableHeadCell>
      </TableHead>
      <TableBody tableBodyClass="divide-y">
        {#if searchTerm !== ''}
          {#each filteredItems as item (item.id)}
						<TableBodyRow on:click={() => toggleRow(item.id)}>
							<TableBodyCell tdClass="px-4 py-3">{item.name}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3">{item.numberOfLecturers}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3">{item.numberOfStudents}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3">{item.actions}</TableBodyCell>
						</TableBodyRow>
						{#if openRow === item.id}
							<TableBodyRow on:dblclick={() => {
								doubleClickModal = true;
								details = item;
							}}>
								<TableBodyCell colspan="4" class="p-0">
									<div class="px-2 py-3" transition:slide={{ duration: 300, axis: 'y' }}>
										<ImagePlaceholder />
									</div>
								</TableBodyCell>
							</TableBodyRow>
						{/if}
          {/each}
        {:else}
          {#each currentPageItems as item (item.id)}
						<TableBodyRow on:click={() => toggleRow(item.id)}>
							<TableBodyCell tdClass="px-4 py-3">{item.name}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3">{item.numberOfLecturers}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3">{item.numberOfStudents}</TableBodyCell>
							<TableBodyCell tdClass="px-4 py-3">{item.actions}</TableBodyCell>
						</TableBodyRow>
						{#if openRow === item.id}
							<TableBodyRow on:dblclick={() => {
								doubleClickModal = true;
								details = item;
							}}>
								<TableBodyCell colspan="4" class="p-0">
									<div class="px-2 py-3" transition:slide={{ duration: 300, axis: 'y' }}>
										<ImagePlaceholder />
									</div>
								</TableBodyCell>
							</TableBodyRow>
						{/if}
          {/each}
        {/if}
      </TableBody>
      <div slot="footer" class="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
      <span class="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing
        <span class="font-semibold text-gray-900 dark:text-white">{startRange}-{endRange}</span>
        of
        <span class="font-semibold text-gray-900 dark:text-white">{totalItems}</span>
      </span>
        <ButtonGroup>
          <Button on:click={loadPreviousPage} disabled={currentPosition === 0}><ChevronLeftOutline size='xs' class='m-1.5'/></Button>
          {#each pagesToShow as pageNumber}
            <Button on:click={() => goToPage(pageNumber)}>{pageNumber}</Button>
          {/each}
          <Button on:click={loadNextPage} disabled={ totalPages === endPage }><ChevronRightOutline size='xs' class='m-1.5'/></Button>
        </ButtonGroup>
      </div>
    </TableSearch>
		<Modal title={details?.name} bind:open={doubleClickModal} autoclose outsideclose>
			<ImagePlaceholder />
		</Modal>
</Section>
