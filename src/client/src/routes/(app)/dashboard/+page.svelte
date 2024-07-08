<script>
	import AdminDashboard from '$lib/components/admin/Dashboard.svelte';
	import StudentDashboard from '$lib/components/student/Dashboard.svelte';

	export let data;

	$: role = data.role;
</script>

{#if role === 'admin'}
	<AdminDashboard {role} />
{:else if role === 'student'}
	<StudentDashboard {role} />
{/if}
