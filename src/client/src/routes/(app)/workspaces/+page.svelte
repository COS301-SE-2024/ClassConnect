<script lang="ts">
	import Workspaces from '$lib/components/workspaces/Main.svelte';
	import AdminWorkspaces from '$src/lib/components/workspaces/Admin.svelte';

	export let data: any;
</script>

{#if data.role === 'admin'}
	<AdminWorkspaces {data} />
{:else}
	<Workspaces {data} />
{/if}
