<script>
	import AdminDashboard from '$src/lib/components/dashboards/admin/Main.svelte';
	import StudentDashboard from '$src/lib/components/dashboards/Student.svelte';
	import NoAccess from '$src/lib/components/common/PageUnavailable.svelte';

	export let data;

	$: role = data.role;
	$: organisation = data.organisation;
</script>

{#if role === 'admin'}
{#if organisation === undefined}
 <NoAccess/>
{:else}
	<AdminDashboard />
{/if}
{:else if role === 'student'}
	<StudentDashboard />
{/if}
