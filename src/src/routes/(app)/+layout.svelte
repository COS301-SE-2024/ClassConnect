<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import Navbar from '$lib/components/common/Navbar.svelte';
	import WorkspaceSidebar from '$src/lib/components/workspaces/workspace/Sidebar.svelte';

	export let data: any;

	let currentPath: string;
	let isWorkspacePage: boolean;

	$: ({ role, workspace } = data);
	$: currentPath = $page.url.pathname;
	$: isWorkspacePage = /^\/workspaces\/[^]+(?:\/|$)/.test(currentPath);

	afterNavigate(() => {
		isWorkspacePage = /^\/workspaces\/[^]+(?:\/|$)/.test($page.url.pathname);
	});
</script>

<div class="flex min-h-screen flex-col bg-gray-100 dark:bg-gray-900">
	{#if isWorkspacePage}
		<div class="flex">
			<aside class="sticky top-0 h-screen w-64 shrink-0 border-r border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
				<WorkspaceSidebar {role} {workspace} />
			<main class="flex-1 p-6">
				<slot />
			</main>
		</div>
	{:else}
		<Navbar {role} />
		<main class="flex-1 p-6 pt-20">
			<slot />
		</main>
	{/if}
</div>

<style>
	:global(body) {
		@apply bg-gray-100 dark:bg-gray-900;
	}
</style>