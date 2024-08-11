<script lang="ts">
	import { Banner } from 'flowbite-svelte';
	import { InfoCircleSolid } from 'flowbite-svelte-icons';

	export let type: string;
	export let color: string;
	export let message: string;
</script>

{#if color === 'green'}
	<Banner color="green" id="cta-banner" position="absolute" bannerType="cta">
		<div
			class="mb-2 flex items-center border-gray-200 md:mb-0 md:me-4 md:border-e md:pe-4 dark:border-gray-600"
		>
			<InfoCircleSolid color="green" class="me-2 h-6" />
			<span class="self-center whitespace-nowrap text-lg font-semibold dark:text-white">{type}</span
			>
		</div>
		<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
	</Banner>
{:else if color === 'red'}
	<Banner color="red" id="cta-banner" position="absolute" bannerType="cta">
		<div
			class="mb-2 flex items-center border-gray-200 md:mb-0 md:me-4 md:border-e md:pe-4 dark:border-gray-600"
		>
			<InfoCircleSolid color="red" class="me-2 h-6" />
			<span class="self-center whitespace-nowrap text-lg font-semibold dark:text-white">{type}</span
			>
		</div>
		<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
	</Banner>
{:else if color === 'blue'}
	<Banner color="blue" id="cta-banner" position="absolute" bannerType="cta">
		<div
			class="mb-2 flex items-center border-gray-200 md:mb-0 md:me-4 md:border-e md:pe-4 dark:border-gray-600"
		>
			<InfoCircleSolid color="blue" class="me-2 h-6" />
			<span class="self-center whitespace-nowrap text-lg font-semibold dark:text-white">{type}</span
			>
		</div>
		<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
	</Banner>
{:else if color === 'yellow'}
	<Banner color="yellow" id="cta-banner" position="absolute" bannerType="cta">
		<div
			class="mb-2 flex items-center border-gray-200 md:mb-0 md:me-4 md:border-e md:pe-4 dark:border-gray-600"
		>
			<InfoCircleSolid color="yellow" class="me-2 h-6" />
			<span class="self-center whitespace-nowrap text-lg font-semibold dark:text-white">{type}</span
			>
		</div>
		<p class="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">{message}</p>
	</Banner>
{/if}
