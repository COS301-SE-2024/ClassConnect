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

<div class="flex">
	{#if isWorkspacePage}
		<!-- Show WorkspaceSidebar and hide Navbar -->
		<div class="sticky top-0 h-screen">
			<WorkspaceSidebar {role} {workspace} />
		</div>
	{:else}
		<!-- Show Navbar and hide WorkspaceSidebar -->
		<div class="main-content">
			<Navbar {role} />
		</div>
	{/if}

	<!-- Main content remains regardless of which is shown -->
	<div class="main-content flex-1">
		<slot />
	</div>
</div>
