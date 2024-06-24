<script lang="ts">
	export let module_name;
	export let module_id;

	import { module } from '$lib/store';
	import { Card, Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import randomImage from '$lib/images/random-image.avif';

	const handleModuleOpening = () => {
		module.set(module_id);
		goto('/student/module');
	};
</script>

<Card img={randomImage}>
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
		{module_name}
	</h5>
	<Button on:click={handleModuleOpening}>
		Open<ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
	</Button>
</Card>
