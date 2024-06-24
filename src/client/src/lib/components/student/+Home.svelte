<script lang="ts">
	export let modules;
	import HomeCard from '$lib/components/utils/student/+HomeCard.svelte';
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold">University of Pretoria</h1>
	<p class="text-lg font-semibold">Computer Science</p>
	<div class="mt-2">
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each modules as module}
				<HomeCard module_name={module.module_name} module_id={module.module_id} />
			{/each}
		</div>
	</div>
</div>
