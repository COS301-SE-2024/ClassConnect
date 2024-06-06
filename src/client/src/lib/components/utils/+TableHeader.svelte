<script lang='ts'>
    export let headers: string[] = [];
</script>
  
<thead class="bg-gray-50 dark:bg-gray-800">
    <tr>
        {#each headers as header, index}
        <th
            scope="col"
            class="px-4 py-3.5 text-left text-sm font-normal text-gray-500 dark:text-gray-400 rtl:text-right"
        >
            <div class="flex items-center gap-x-3">
            <span>{header}</span>
            </div>
        </th>
        {/each}
    </tr>
</thead>
  
  