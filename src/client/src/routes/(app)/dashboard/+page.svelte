<script>
	import AdminDashboard from '$src/lib/components/dashboards/Admin.svelte';
	import StudentDashboard from '$src/lib/components/dashboards/Student.svelte';

	export let data;

	$: role = data.role;
</script>

{#if role === 'admin'}
	<AdminDashboard />
{:else if role === 'student'}
	<StudentDashboard />
{/if}
