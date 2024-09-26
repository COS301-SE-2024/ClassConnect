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

<Card class="h-full overflow-hidden" padding="none">
	<div class="relative h-40">
		<img src={image} alt={name} class="h-full w-full object-cover" />
		<div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
	</div>
	<div class="p-4">
		<h5 class="mb-1 text-xl font-bold tracking-tight text-gray-900 dark:text-white">{name}</h5>
		<p class="mb-2 line-clamp-2 text-sm text-gray-700 dark:text-gray-400">{description}</p>
		<Button size="sm" on:click={openWorkspace} on:mouseenter={() => handleMouseEnter('Open')}>
			Open <ArrowRightOutline class="ms-2 h-4 w-4" />
		</Button>
	</div>
</Card>
