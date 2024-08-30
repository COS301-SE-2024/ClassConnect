<script lang="ts">
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	import axios from 'axios';

	let breadcrumbItems: any[];
	const apiUrl = '/api/workspaces';
	let workID = 'work-id';
	let workspace = {
		name: '',
		id: ''
	};

	async function getWorkspaceDetails(workspaceId: string): Promise<string> {
		if (workspace.id !== workspaceId) {
			workID = workspaceId;
			if (!workID || workID === 'work-id') return 'workspace';
			try {
				const response = await axios.get(apiUrl, { params: { workID } });
				workspace = response.data;
				return workspace.name.charAt(0).toUpperCase() + workspace.name.slice(1);
			} catch (error: any) {
				if (error.response) {
					console.error('Error response data:', error.response.data);
					console.error('Error response status:', error.response.status);
				} else if (error.request) {
					console.error('Error request:', error.request);
				} else {
					console.error('Error message:', error.message);
				}
				return 'workspace';
			}
		} else {
			return workspace.name;
		}
	}

	async function checkForWorkspace() {
		const regex = /^[a-f\d]{24}$/i;
		for (let i = 0; i < breadcrumbItems.length; i++) {
			const name = breadcrumbItems[i].name;
			const match = name.match(regex);
			if (match) {
				if (workspace.id !== name) {
					workID = name;
					breadcrumbItems[i].name = await getWorkspaceDetails(workID);
				} else {
					breadcrumbItems[i].name = workspace.name;
				}
			}
		}
	}

	async function updateBreadcrumbs() {
		const path = $page.url.pathname.split('/').filter(Boolean);

		breadcrumbItems = path.map((segment, index) => {
			const href = '/' + path.slice(0, index + 1).join('/');
			return { name: segment.charAt(0).toUpperCase() + segment.slice(1), href };
		});
		await checkForWorkspace();
	}

	afterNavigate(() => {
		updateBreadcrumbs();
	});

	updateBreadcrumbs();
</script>

<Breadcrumb aria-label="Default breadcrumb example" data-testid="breadcrumbs">
	<BreadcrumbItem href="/" home>Home</BreadcrumbItem>
	{#each breadcrumbItems as item}
		<BreadcrumbItem href={item.href}>{item.name}</BreadcrumbItem>
	{/each}
</Breadcrumb>
