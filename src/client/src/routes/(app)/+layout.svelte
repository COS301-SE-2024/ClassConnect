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
	{#key currentPath}
		{#if isWorkspacePage}
			<WorkspaceSidebar {role} {workspace} />
		{:else}
			<SideBar {role} />
		{/if}
	{/key}

	<div class="flex-1">
		<Header {data} />
		<slot />
	</div>
</div>
