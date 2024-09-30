<script lang="ts">
	import Workspaces from '$lib/components/workspaces/Main.svelte';
	import AdminWorkspaces from '$src/lib/components/workspaces/Admin.svelte';
	import NoAccess from '$src/lib/components/common/PageUnavailable.svelte';

	export let data: any;
</script>

{#if data.role === 'admin'}
	{#if data.organisation === undefined}
		<NoAccess />
	{:else}
		<AdminWorkspaces {data} />
	{/if}
{:else}
	<Workspaces {data} />
{/if}
