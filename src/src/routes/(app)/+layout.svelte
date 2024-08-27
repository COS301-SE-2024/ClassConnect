<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	import Header from '$lib/components/common/Header.svelte';
	import SideBar from '$lib/components/common/SideBar.svelte';
	import WorkspaceSidebar from '$src/lib/components/workspaces/workspace/Sidebar.svelte';

	export let data: any;

	let currentPath: string;
	let isWorkspacePage: boolean;
	let isMobile: boolean = false;
	let showSidebar: boolean = false;

	$: ({ role, workspace } = data);
	$: currentPath = $page.url.pathname;
	$: isWorkspacePage = /^\/workspaces\/[^]+(?:\/|$)/.test(currentPath);

	afterNavigate(() => {
		isWorkspacePage = /^\/workspaces\/[^]+(?:\/|$)/.test($page.url.pathname);
	});

	const handleResize = () => {
		isMobile = window.innerWidth < 768;
	};

	onMount(() => {
		handleResize();
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	});

	const toggleSidebar = () => {
		showSidebar = !showSidebar;
	};
</script>

<div class="flex">
	{#if isMobile}
		<button on:click={toggleSidebar} class="p-2 focus:outline-none">
			{#if showSidebar}
				<!-- Close icon -->
				<span>&#x2716;</span>
			{:else}
				<!-- Hamburger icon -->
				<span>&#9776;</span>
			{/if}
		</button>

		{#if showSidebar}
			<div class="fixed inset-0 bg-black bg-opacity-50 z-10" on:click={toggleSidebar}></div>
			<div class="fixed top-0 left-0 h-screen z-20">
				{#if isWorkspacePage}
					<WorkspaceSidebar {role} {workspace} />
				{:else}
					<SideBar {role} />
				{/if}
			</div>
		{/if}
	{:else}
		<div class="sticky top-0 h-screen">
			{#if isWorkspacePage}
				<WorkspaceSidebar {role} {workspace} />
			{:else}
				<SideBar {role} />
			{/if}
		</div>
	{/if}

	<div class="main-content flex-1">
		<div class="sticky top-0">
			<Header {data} />
		</div>

		<slot />
	</div>
</div>
