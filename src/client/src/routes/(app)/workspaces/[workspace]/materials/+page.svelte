<script lang="ts">
	import Card from '$lib/components/common/materials/Card.svelte';

	export let data;
	let { materials }: any = data;
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold dark:text-white">Materials</h1>
	<div class="mt-2">
		{#if materials && materials.length > 0}
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each materials as material}
					<Card title={material.title} description={material.description} />
				{/each}
			</div>
		{:else}
			<p class="mt-4 text-center text-gray-600 dark:text-white">There are no materials available</p>
		{/if}
	</div>
</div>
