<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	import { workspaces, quizzes } from '$lib/store/user';

	export let maps;

	let breadcrumbItems: any[] = [];
	let { workspacesMap, quizzesMap } = maps;

	function updateBreadcrumbs() {
		const path = $page.url.pathname.split('/').filter(Boolean);

		breadcrumbItems = path.map((segment, index) => {
			const href = '/' + path.slice(0, index + 1).join('/');

			if (index > 0 && path[index - 1].toLowerCase() === 'workspaces') {
				segment = $workspaces[segment] || 'Workspace';
			}

			if (index > 0 && path[index - 1].toLowerCase() === 'quizzes') {
				segment = $quizzes[segment] || 'Quiz';
			}

			return { href, name: segment.charAt(0).toUpperCase() + segment.slice(1) };
		});
	}

	$: quizzes.set(quizzesMap);
	$: workspaces.set(workspacesMap);

	afterNavigate(updateBreadcrumbs);

	updateBreadcrumbs();
</script>

<Breadcrumb data-testid="breadcrumbs">
	<BreadcrumbItem href="/" home>Home</BreadcrumbItem>

	{#if breadcrumbItems}
		{#each breadcrumbItems as item}
			<BreadcrumbItem href={item.href}>{item.name}</BreadcrumbItem>
		{/each}
	{/if}
</Breadcrumb>
