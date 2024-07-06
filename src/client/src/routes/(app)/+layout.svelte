<script lang="ts">
	import { page } from '$app/stores';
	import type { LayoutData } from './$types';
	import Header from '$lib/components/common/Header.svelte';
	import SideBar from '$lib/components/common/SideBar.svelte';
	import WorkspaceSidebar from '$lib/components/common/workspace/Sidebar.svelte';

	export let data: LayoutData;
	let { role, workspace } = data;

	$: $page.url.pathname;
	$: isWorkspacePage = /^\/workspaces\/[^\/]+(?:\/|$)/.test($page.url.pathname);
</script>

<div class="flex">
	{#if isWorkspacePage}
		<WorkspaceSidebar {role} {workspace} />
	{:else}
		<SideBar {role} />
	{/if}

	<div class="flex-1">
		<Header {data} />
		<slot />
	</div>
</div>
