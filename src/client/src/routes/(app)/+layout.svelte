<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';

	import Header from '$lib/components/common/Header.svelte';
	import SideBar from '$lib/components/common/SideBar.svelte';
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
		<div class="sticky top-0 h-screen">
			<WorkspaceSidebar {role} {workspace} />
		</div>
	{:else}
		<div class="sticky top-0 h-screen">
			<SideBar {role} />
		</div>
	{/if}

	<div class="main-content flex-1">
		<div class="sticky top-0">
			<Header {data} />
		</div>
		<slot />
	</div>
</div>
