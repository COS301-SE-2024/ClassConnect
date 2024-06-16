<script lang="ts">
	import StudyCard from '$lib/components/utils/universal/cards/+StudyCard.svelte';
	export let materials;
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold">Computer Science</h1>
	<p class="text-lg font-semibold">Computer Networks</p>
	<div class="mt-2">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each materials as material}
				<StudyCard title={material.title} description={material.description} link={material.link} />
			{/each}
		</div>
	</div>
</div>
