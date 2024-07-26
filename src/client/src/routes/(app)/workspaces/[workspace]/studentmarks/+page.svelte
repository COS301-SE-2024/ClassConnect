<script lang="ts">
  import { onMount } from 'svelte';
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch, Button, Dropdown, DropdownItem, Checkbox, ButtonGroup } from 'flowbite-svelte';
  import { Section } from 'flowbite-svelte-blocks';
  import paginationData from '$lib/components/common/advancedTable.json'
  import { PlusOutline, ChevronDownOutline, FilterSolid, ChevronRightOutline, ChevronLeftOutline } from 'flowbite-svelte-icons';

  let divClass='bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden';
  let innerDivClass='flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4';
  let searchClass='w-full md:w-1/2 relative';
  let svgDivClass='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none';
  let classInput="text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2  pl-10";

  let searchTerm = '';
  let currentPosition = 0;
  const itemsPerPage = 10;
  const showPage = 5;
  let totalPages = 0;
  let pagesToShow: any[] = [];
  let totalItems = paginationData.length;
  let startPage: number;
  let endPage: number;

  const updateDataAndPagination = () => {
    const currentPageItems = paginationData.slice(currentPosition, currentPosition + itemsPerPage);
    renderPagination(currentPageItems.length);
  }

  const loadNextPage = () => {
    if (currentPosition + itemsPerPage < paginationData.length) {
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
    totalPages = Math.ceil(paginationData.length / itemsPerPage);
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
    // Call renderPagination when the component initially mounts
    renderPagination(paginationData.length);
  });

  $: currentPageItems = paginationData.slice(currentPosition, currentPosition + itemsPerPage);
  $: filteredItems = paginationData.filter((item) => item.student_name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1);

  function getColor(score: number): string {
  if (score <= 40) {
    return '#FFCCCB'; // Light red
  } else if (score <= 65) {
    return '#FFFFA1'; // Light yellow
  } else {
    return '#BBF7D0'; // Light green
  }
}
</script>

<Section name="advancedTable" classSection='bg-gray-50 dark:bg-gray-900 p-3 sm:p-5'>
    <TableSearch placeholder="Search" hoverable={true} bind:inputValue={searchTerm} {divClass} {innerDivClass} {searchClass} {classInput} >

    <div slot="header" class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
      <Button>
        <PlusOutline class="h-3.5 w-3.5 mr-2" />Add Student
      </Button>
      <Button color='alternative'>Actions<ChevronDownOutline class="w-3 h-3 ml-2 " /></Button>
        <Dropdown class="w-44 divide-y divide-gray-100">
          <DropdownItem>Mass Edit</DropdownItem>
          <DropdownItem>Delete all</DropdownItem>
        </Dropdown>
      <Button color='alternative'>Filter<FilterSolid class="w-3 h-3 ml-2 " /></Button>
        <Dropdown class="w-48 p-3 space-y-2 text-sm">
          <h6 class="mb-3 text-sm font-medium text-gray-900 dark:text-white">Choose assignment</h6>
          <li>
            <Checkbox>Assignment 1</Checkbox>
          </li>
          <li>
            <Checkbox>Assignment 2</Checkbox>
          </li>
          <li>
            <Checkbox>Assignment 3</Checkbox>
          </li>
          <li>
            <Checkbox>Assignment 4</Checkbox>
          </li>
        </Dropdown>
    </div>
      <TableHead>
        <TableHeadCell padding="px-4 py-3" scope="col">Student</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Assignment 1</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Assignment 2</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Assignment 3</TableHeadCell>
        <TableHeadCell padding="px-4 py-3" scope="col">Assignment 4</TableHeadCell>
      </TableHead>
      <TableBody class="divide-y">
        {#if searchTerm !== ''}
          {#each filteredItems as item (item.id)}
            <TableBodyRow>
              <TableBodyCell tdClass="px-4 py-3">{item.student_name}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3" style="background-color: {getColor(item.assignment_1)}">{item.assignment_1}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3" style="background-color: {getColor(item.assignment_2)}">{item.assignment_2}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3" style="background-color: {getColor(item.assignment_3)}">{item.assignment_3}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3" style="background-color: {getColor(item.assignment_4)}">{item.assignment_4}</TableBodyCell>
            </TableBodyRow>
          {/each}
        {:else}
          {#each currentPageItems as item (item.id)}
            <TableBodyRow>
              <TableBodyCell tdClass="px-4 py-3">{item.student_name}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3" style="background-color: {getColor(item.assignment_1)}">{item.assignment_1}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3" style="background-color: {getColor(item.assignment_2)}">{item.assignment_2}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3" style="background-color: {getColor(item.assignment_3)}">{item.assignment_3}</TableBodyCell>
              <TableBodyCell tdClass="px-4 py-3" style="background-color: {getColor(item.assignment_4)}">{item.assignment_4}</TableBodyCell>
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
          <Button on:click={loadNextPage} disabled={ totalPages === endPage }><ChevronRightOutline size='xs' class='m-1.5'/></Button>
        </ButtonGroup>
      </div>
    </TableSearch>
</Section>

<!--
<script lang="ts">
  import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell } from 'flowbite-svelte';
  import { Input } from 'flowbite-svelte';

  // Sample data (replace with your actual data)
  let assessments = ['Midterm', 'Final Exam', 'Project'];
  let students = [
    { name: 'Alice', grades: [85, 92, 78] },
    { name: 'Bob', grades: [72, 68, 95] },
    { name: 'Charlie', grades: [90, 88, 8] },
    // Add more students...
  ];

  let searchTerm = '';

  $: filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function getColorClass(grade: number) {
    if (grade < 60) return 'bg-red-500 dark:bg-red-900';
    if (grade < 80) return 'bg-yellow-200 dark:bg-yellow-900';
    return 'bg-green-200 dark:bg-green-900';
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Grade Book</h1>

  <Input type="text" placeholder="Search by student name" bind:value={searchTerm} class="mb-4" />

  <Table striped={true}>
    <TableHead>
      <TableHeadCell>Student Name</TableHeadCell>
      {#each assessments as assessment}
        <TableHeadCell>{assessment}</TableHeadCell>
      {/each}
    </TableHead>
    <TableBody>
      {#each filteredStudents as student}
        <TableBodyRow>
          <TableBodyCell>{student.name}</TableBodyCell>
          {#each student.grades as grade}
            <TableBodyCell class={getColorClass(grade)}>
              {grade}%
            </TableBodyCell>
          {/each}
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</div>
-->