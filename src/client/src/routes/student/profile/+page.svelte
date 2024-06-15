<script lang="ts">
	import StudentSideBar from '$lib/components/utils/student/+SideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Contruction from '$lib/components/universal/+Construction.svelte'
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
