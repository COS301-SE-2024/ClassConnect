<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
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

<div class="group relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-xl">
	<div class="absolute inset-0 bg-gradient-to-br from-white/50 to-white/10 backdrop-blur-md transition-all duration-300 group-hover:backdrop-blur-lg dark:from-gray-800/50 dark:to-gray-900/10"></div>
	<div class="relative z-10 p-5">
		<div class="mb-4 h-40 w-full overflow-hidden rounded-lg">
			<img src={image} alt={name} class="h-full w-full object-cover transition-all duration-300 group-hover:scale-110" />
		</div>
		<h4 class="mb-2 text-3xl font-bold tracking-tight text-white transition-colors duration-300">
			{name}
		</h4>

		<h5 class="text-l mb-4 tracking-tight text-white transition-colors duration-300">
			{description}
		</h5>

		<Button on:click={openWorkspace} class="w-full bg-gradient-to-r from-green-400 to-emerald-600 text-white transition-all duration-300 hover:from-green-500 hover:to-emerald-700 dark:from-green-600 dark:to-emerald-800 dark:hover:from-green-700 dark:hover:to-emerald-900">
			Open <ArrowRightOutline class="ms-2 h-6 w-6" />
		</Button>
	</div>
</div>

<style>
	:global(.dark) {
		color-scheme: dark;
	}
</style>