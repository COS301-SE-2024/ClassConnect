<script lang="ts">
	import { goto } from '$app/navigation';
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';

	export let workspace;
	let { id, name, image, description } = workspace;
</script>

<Card img={image} imgClass="h-40 w-full object-fit">
	<h4 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
		{name}
	</h4>

	<h5 class="mb-2 text-l font-bold tracking-tight text-gray-900 dark:text-white">
		{description}
	</h5>

	<Button on:click={() => goto(`/workspaces/${id}`)}>
		Open<ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
	</Button>
</Card>
