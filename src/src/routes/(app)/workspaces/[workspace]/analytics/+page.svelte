<script lang="ts">
	import LineChart from '$lib/components/grades/LineChart.svelte';

	export let data: any;

	let assessments = data.assessmentStats;
</script>

<main class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold dark:text-white">Analytics</h1>

	{#if data.assessmentStats.length === 0}
		<p class="text-lg dark:text-white">No data available</p>
	{:else}
		<div class="mt-8">
			<h2 class="mb-2 text-2xl font-bold dark:text-white">Class Tests</h2>

			<LineChart data={assessments} />
		</div>
	{/if}
</main>
