<script lang="ts">
	import StudentSideBar from '$lib/components/utils/+StudentSideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
</script>

<main>
	<div class="flex">
		<StudentSideBar />
		<div class="flex-1">
			<TopBar />
			<div class="p-4">
				<h1 class="text-2xl font-bold">Student Page</h1>
				<p>This is the student page</p>
			</div>
		</div>
	</div>
</main>
