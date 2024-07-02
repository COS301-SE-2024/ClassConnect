<script>
	import AdminDashboard from '$lib/components/admin/Dashboard.svelte';

	export let data;
</script>

{#if data.role === 'admin'}
	<AdminDashboard {data} />
{:else if data.role === 'student'}
	<p>StudentDashboard</p>
{:else}
	<p>Unauthorized</p>
{/if}
