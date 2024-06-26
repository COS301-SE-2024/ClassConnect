<script lang="ts">
	import StudentSideBar from '$lib/components/student/+SideBar.svelte';
	import TopBar from '$lib/components/universal/+TopBar.svelte';
	import Contruction from '$lib/components/student/+StudentFAQ.svelte';
</script>

<main>
	<div class="flex">
		<StudentSideBar />
		<div class="flex-1">
			<TopBar />
			<Contruction />
		</div>
	</div>
</main>
