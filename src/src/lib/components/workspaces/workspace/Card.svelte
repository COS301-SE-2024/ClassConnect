<script lang="ts">
	import { goto } from '$app/navigation';
	import { handleMouseEnter } from '$src/utils/keyboard';
	import { Card, Button } from 'flowbite-svelte';
	import { ArrowRightOutline } from 'flowbite-svelte-icons';
	
	

	export let workspace;
	export let role: string;
	let { id, name, image, description } = workspace;

	function openWorkspace() {
		if (role === 'lecturer') {
			goto(`/workspaces/${id}/dashboard`);
		} else {
			goto(`/workspaces/${id}/announcements`);
		}
	}
</script>

<Card img={image} imgClass="h-40 w-full object-fit" >
	<h4 class="mb-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
		{name}
	</h4>

	<h5 class="text-l mb-2 tracking-tight text-gray-900 dark:text-white">
		{description}
	</h5>

	<Button on:click={openWorkspace} on:mouseenter={() => handleMouseEnter('Open')} >
		Open <ArrowRightOutline class="ms-2 h-6 w-6 text-white" />
	</Button>
</Card>
