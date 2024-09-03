<script lang="ts">
  import { onMount } from 'svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup } from 'flowbite-svelte';
  import { Section } from 'flowbite-svelte-blocks';
  import { PlusOutline, ChevronDownOutline, FilterSolid, ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import CancelModal from '$src/lib/components/modals/lessons/Cancel.svelte';

  export let role: string;
  export let lessons: any[];

  let divClass = 'bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
  let innerDivClass = 'flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
  let searchClass = 'w-full md:w-1/2 relative';
  let classInput = "text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2 pl-10";

  let searchTerm = '';
  let currentPosition = 0;
  const itemsPerPage = 10;
  const showPage = 5;
  let totalPages = 0;
  let pagesToShow: number[] = [];
  let totalItems = lessons.length;
  let startPage: number;
  let endPage: number;

  let id: string;
  let isCancelModalOpen = false;
  const headers = ['Topic', 'Description', 'Date', 'Time', 'Actions'];

  const updateDataAndPagination = () => {
    const currentPageItems = lessons.slice(currentPosition, currentPosition + itemsPerPage);
    renderPagination(currentPageItems.length);
  }

  const loadNextPage = () => {
    if (currentPosition + itemsPerPage < lessons.length) {
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

  const renderPagination = (totalItems: number) => {
    totalPages = Math.ceil(lessons.length / itemsPerPage);
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
    renderPagination(lessons.length);
  });

  $: currentPageItems = lessons.slice(currentPosition, currentPosition + itemsPerPage);
  $: filteredItems = lessons.filter((lesson) => lesson.topic.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);
</script>

<Section name="advancedTable" classSection='bg-gray-50 dark:bg-gray-900 p-3 sm:p-5'>
  <TableSearch placeholder="Search by topic" hoverable={true} bind:inputValue={searchTerm} {divClass} {innerDivClass} {searchClass} {classInput}>
    <div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
      <Button>
        <PlusOutline class="h-3.5 w-3.5 mr-2" />Add lesson
      </Button>
      <Button color='alternative'>Actions<ChevronDownOutline class="w-3 h-3 ml-2 " /></Button>
      <Dropdown class="w-44 divide-y divide-gray-100">
        <DropdownItem>Mass Edit</DropdownItem>
        <DropdownItem>Delete all</DropdownItem>
      </Dropdown>
    </div>
    <TableHead>
      {#each headers as header}
        <TableHeadCell padding="px-4 py-3">{header}</TableHeadCell>
      {/each}
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#if searchTerm !== ''}
        {#each filteredItems as lesson (lesson.id)}
          <TableBodyRow>
            <TableBodyCell tdClass="px-4 py-3">{lesson.topic}</TableBodyCell>
            <TableBodyCell tdClass="px-4 py-3">{lesson.description}</TableBodyCell>
            <TableBodyCell tdClass="px-4 py-3">{lesson.date}</TableBodyCell>
            <TableBodyCell tdClass="px-4 py-3">{lesson.time}</TableBodyCell>
            <TableBodyCell tdClass="px-4 py-3">
              <Button class="mr-2" size="sm" on:click={() => goto($page.url + '/' + lesson.id)}>
                Join
              </Button>
              {#if role === 'lecturer'}
                <Button
                  size="sm"
                  color="red"
                  on:click={() => {
                    id = lesson.id;
                    isCancelModalOpen = true;
                  }}
                >
                  Cancel
                </Button>
              {/if}
            </TableBodyCell>
          </TableBodyRow>
        {/each}
      {:else}
        {#each currentPageItems as lesson (lesson.id)}
          <TableBodyRow>
            <TableBodyCell tdClass="px-4 py-3">{lesson.topic}</TableBodyCell>
            <TableBodyCell tdClass="px-4 py-3">{lesson.description}</TableBodyCell>
            <TableBodyCell tdClass="px-4 py-3">{lesson.date}</TableBodyCell>
            <TableBodyCell tdClass="px-4 py-3">{lesson.time}</TableBodyCell>
            <TableBodyCell tdClass="px-4 py-3">
              <Button class="mr-2" size="sm" on:click={() => goto($page.url + '/' + lesson.id)}>
                Join
              </Button>
              {#if role === 'lecturer'}
                <Button
                  size="sm"
                  color="red"
                  on:click={() => {
                    id = lesson.id;
                    isCancelModalOpen = true;
                  }}
                >
                  Cancel
                </Button>
              {/if}
            </TableBodyCell>
          </TableBodyRow>
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
        <Button on:click={loadNextPage} disabled={totalPages === endPage}><ChevronRightOutline size='xs' class='m-1.5'/></Button>
      </ButtonGroup>
    </div>
  </TableSearch>
</Section>

<CancelModal bind:open={isCancelModalOpen} {id} />