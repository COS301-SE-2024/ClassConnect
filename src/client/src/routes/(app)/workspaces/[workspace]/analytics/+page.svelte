<script lang="ts">
	import LineChart from '$lib/components/grades/LineChart.svelte';

	export let data: any;

	let assessments = data.assessmentStats;
</script>

<main class="container mx-auto p-4">
	<h1 class="mb-4 text-3xl font-bold">Analytics</h1>

	<div class="mt-8">
		<h2 class="mb-2 text-2xl font-bold">Class Tests</h2>

		<LineChart data={assessments} />
	</div>
</main>
