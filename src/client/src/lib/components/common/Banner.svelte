<script lang='ts'>
    import { Banner } from 'flowbite-svelte';
    import { InfoCircleSolid } from 'flowbite-svelte-icons';
    export let color: string;
    export let type: string;
    export let message: string;
</script>

{#if color==='green'}
<Banner color='green' id="cta-banner" position="absolute" bannerType="cta">
    <div class="flex items-center mb-2 border-gray-200 md:pe-4 md:me-4 md:border-e md:mb-0 dark:border-gray-600">
        <InfoCircleSolid color='green' class="h-6 me-2" />
        <span class="self-center text-lg font-semibold whitespace-nowrap dark:text-white">{type}</span>
    </div>
    <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
</Banner>
{:else if color==='red'}
<Banner color='red' id="cta-banner" position="absolute" bannerType="cta">
    <div class="flex items-center mb-2 border-gray-200 md:pe-4 md:me-4 md:border-e md:mb-0 dark:border-gray-600">
        <InfoCircleSolid color='red' class="h-6 me-2" />
        <span class="self-center text-lg font-semibold whitespace-nowrap dark:text-white">{type}</span>
    </div>
    <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
</Banner>
{:else if color==='blue'}
<Banner color='blue' id="cta-banner" position="absolute" bannerType="cta">
    <div class="flex items-center mb-2 border-gray-200 md:pe-4 md:me-4 md:border-e md:mb-0 dark:border-gray-600">
        <InfoCircleSolid color='blue' class="h-6 me-2" />
        <span class="self-center text-lg font-semibold whitespace-nowrap dark:text-white">{type}</span>
    </div>
    <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
</Banner>
{:else if color==='yellow'}
<Banner color='yellow' id="cta-banner" position="absolute" bannerType="cta">
    <div class="flex items-center mb-2 border-gray-200 md:pe-4 md:me-4 md:border-e md:mb-0 dark:border-gray-600">
        <InfoCircleSolid color='yellow' class="h-6 me-2" />
        <span class="self-center text-lg font-semibold whitespace-nowrap dark:text-white">{type}</span>
    </div>
    <p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
</Banner>
{/if}