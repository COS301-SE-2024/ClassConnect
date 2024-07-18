<!-- GenericTable.svelte -->
<script>
  import { TableSearch, TableHead, TableHeadCell, TableBody } from "flowbite-svelte";
  import GenericRow from './GenericRow.svelte';

  export let data = [];
  export let headers = [];
  export let searchPlaceholder = "Search";
  export let searchFields = [];
  export let rowComponent = GenericRow;
  export let customProps = {};

  let searchTerm = '';

  $: filteredData = data.filter(item => 
    searchFields.some(field => 
      item[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );
</script>

<div class="overflow-x-auto">
  <TableSearch placeholder={searchPlaceholder} hoverable={true} bind:inputValue={searchTerm} class="w-full">
    <TableHead>
      {#each headers as header}
        <TableHeadCell class="text-sm sm:text-base">{header.label}</TableHeadCell>
      {/each}
    </TableHead>
    <TableBody tableBodyClass="divide-y">
      {#each filteredData as item (item.id)}
        <svelte:component this={rowComponent} {item} {headers} {...customProps} />
      {/each}
    </TableBody>
  </TableSearch>
</div>

<!-- GenericRow.svelte -->
<script>
  import { TableBodyRow, TableBodyCell } from "flowbite-svelte";
  import { EditOutline, TrashBinOutline } from "flowbite-svelte-icons";
  import GenericCell from './GenericCell.svelte';
  import ActionButtons from './ActionButtons.svelte';

  export let item;
  export let headers;
  export let onEdit = () => {};
  export let onDelete = () => {};
</script>

<TableBodyRow>
  {#each headers as header}
    {#if header.key !== 'actions'}
      <GenericCell value={item[header.key]} type={header.type} />
    {:else}
      <TableBodyCell>
        <ActionButtons 
          onEdit={() => onEdit(item.id)} 
          onDelete={() => onDelete(item.id)} 
        />
      </TableBodyCell>
    {/if}
  {/each}
</TableBodyRow>

<!-- GenericCell.svelte -->
<script>
  import { TableBodyCell } from "flowbite-svelte";

  export let value;
  export let type = 'text';
</script>

<TableBodyCell>
  {#if type === 'image'}
    <img src={value} alt="Item image" class="h-8 w-8 sm:h-10 sm:w-10 rounded-full flex-shrink-0" />
  {:else if type === 'text'}
    <div class="font-semibold text-sm sm:text-base truncate">{value}</div>
  {:else if type === 'email'}
    <a href="mailto:{value}" class="text-blue-600 hover:underline">{value}</a>
  {:else}
    {value}
  {/if}
</TableBodyCell>

<!-- ActionButtons.svelte -->
<script>
  import { Button } from "flowbite-svelte";
  import { EditOutline, TrashBinOutline } from "flowbite-svelte-icons";

  export let onEdit;
  export let onDelete;
</script>

<div class="flex justify-end space-x-2">
  <Button color="purple" on:click={onEdit} class="p-1.5 sm:p-2">
    <EditOutline class="w-4 h-4 sm:w-5 sm:h-5" />
    <span class="hidden sm:inline ml-2 text-sm">Edit</span>
  </Button>
  <Button color="red" on:click={onDelete} class="p-1.5 sm:p-2">
    <TrashBinOutline class="w-4 h-4 sm:w-5 sm:h-5" />
    <span class="hidden sm:inline ml-2 text-sm">Delete</span>
  </Button>
</div>