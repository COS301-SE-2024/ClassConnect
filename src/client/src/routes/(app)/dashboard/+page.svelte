<script>
	import AdminDashboard from '$lib/components/admin/Dashboard.svelte';
	import StudentDashboard from '$lib/components/student/Dashboard.svelte';

	export let data;
</script>

{#if data.role === 'admin'}
	<AdminDashboard {data} />
{:else if data.role === 'student'}
	<StudentDashboard {data} />
{/if}
