<script lang="ts">
	import { Button, Card } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	import AddModal from '$lib/components/modals/user/Add.svelte';

	let isAddModalOpen = false;
	export let imgSrc: string;
	export let title: string;
	export let description: string;
	export let buttonText: string;
	export let role: string;
</script>

<Card img={imgSrc} size="none" imgClass="w-auto h-auto object-cover" role="img">
	<div class="p-4">
		<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{title}</h5>
		<p class="mb-3 font-normal leading-tight text-gray-700 dark:text-gray-400">{description}</p>
		<Button on:click={() => (isAddModalOpen = true)}>
			{buttonText}
			<ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
		</Button>
	</div>
</Card>

<!--This needs to be updated depending on the user-->
<AddModal bind:open={isAddModalOpen} {role} />
