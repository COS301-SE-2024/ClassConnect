<script>
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	/**
	 * @type {any[]}
	 */
	let breadcrumbItems = [];

	// Function to update breadcrumb items based on the current URL
	function updateBreadcrumbs() {
		const path = $page.url.pathname.split('/').filter(Boolean);
		breadcrumbItems = path.map((segment, index) => {
			const href = '/' + path.slice(0, index + 1).join('/');
			return { name: segment.charAt(0).toUpperCase() + segment.slice(1), href };
		});
	}

	// Call updateBreadcrumbs when the component is first mounted
	onMount(() => {
		updateBreadcrumbs();
	});

	// Call updateBreadcrumbs whenever the URL changes
	$: updateBreadcrumbs();
</script>

<Breadcrumb aria-label="Default breadcrumb example">
	{#each breadcrumbItems as item}
		<BreadcrumbItem href={item.href}>{item.name}</BreadcrumbItem>
	{/each}
</Breadcrumb>
