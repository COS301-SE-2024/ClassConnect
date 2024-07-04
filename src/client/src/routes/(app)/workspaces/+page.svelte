<script lang="ts">
	import AdminWorkspaces from '$lib/components/admin/Workspaces.svelte';
	import LecturerWorkspaces from '$lib/components/lecturer/Workspaces.svelte';

	export let data: any;
</script>

{#if data.role === 'admin'}
	<AdminWorkspaces {data} />
{:else if data.role === 'lecturer'}
	<LecturerWorkspaces {data} />
{:else if data.role === 'student'}
	<p>StudentDashboard</p>
{:else}
	<p>Unauthorized</p>
{/if}
