<script lang="ts">
    import Card from '$lib/components/materials/Card.svelte';
    import {TabItem, Button } from 'flowbite-svelte'
    import UploadMaterial from '$lib/components/modals/materials/UploadMaterial.svelte';
    import {  ArrowUpFromBracketOutline } from 'flowbite-svelte-icons';

    export let tabName:any;
    export let tabBoolean:boolean;
    export let renderedMaterials : any[] = [];

    let materialSearchTerm = '';

    $: filteredItems = renderedMaterials.filter((material:any) =>
        material.title.toLowerCase().includes(materialSearchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(materialSearchTerm.toLowerCase())
    );

    let uploadModal  = false;

</script>


<TabItem open={tabBoolean}>
    <span slot="title">{tabName}</span>
    <div class="flex justify-between items-center mt-4 space-x-2">
        <div class="max-w-lg">
            <!-- SearchBox -->
            <div class="relative">
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center pointer-events-none z-20 ps-3.5">
                  <svg class="flex-shrink-0 size-4 text-gray-400 dark:text-white/60" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                  </svg>
                </div>
                <input bind:value={materialSearchTerm} class="py-3 ps-10 pe-4 block w-full border-gray-200 rounded-lg text-lg focus:border-green-500 focus:ring-green-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-400 dark:placeholder-neutral-500 dark:focus:ring-neutral-600" type="text" placeholder="Type a name" data-hs-combo-box-input="">
              </div>
            </div>
            <!-- End SearchBox -->
        </div>
        <Button on:click={() => (uploadModal = true)} class="flex items-center space-x-1">
            <ArrowUpFromBracketOutline class="h-5 w-5" />
            <span>Upload File</span>
        </Button>
    </div>
    
    {#if filteredItems && filteredItems.length > 0}
        <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {#each filteredItems as material}
                <Card 
                    title={material.title} 
                    description={material.description} 
                    thumbnail={material.thumbnail} 
                    url={material.file_path} 
                    type={material.type}
                    id={material.id}
                />
            {/each}
        </div>
    {:else}
        <p class="mt-4 text-center text-gray-600 dark:text-white">
            There are no materials available
        </p>
    {/if}
</TabItem>

<!-- Upload modal -->
<UploadMaterial open={uploadModal} on:close={() => uploadModal = false} />