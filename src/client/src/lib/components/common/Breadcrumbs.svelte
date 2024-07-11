<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';

	let breadcrumbItems: any[];

	function updateBreadcrumbs() {
		const path = $page.url.pathname.split('/').filter(Boolean);

		breadcrumbItems = path.map((segment, index) => {
			const href = '/' + path.slice(0, index + 1).join('/');

			return { name: segment.charAt(0).toUpperCase() + segment.slice(1), href };
		});
	}

	onMount(() => {
		updateBreadcrumbs();
	});

	$: updateBreadcrumbs();
</script>

<Breadcrumb aria-label="Default breadcrumb example">
	{#each breadcrumbItems as item}
		<BreadcrumbItem href={item.href}>{item.name}</BreadcrumbItem>
	{/each}
</Breadcrumb>
