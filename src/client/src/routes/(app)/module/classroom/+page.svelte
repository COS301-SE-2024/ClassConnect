<script lang="ts">
	import ModuleSideBar from '$lib/components/utils/student/+ModuleSideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Lessons from '$lib/components/lecturer/+Lessons.svelte';
</script>

<main>
	<div class="flex">
		<ModuleSideBar />
		<div class="flex-1">
			<TopBar />
			<Lessons />
		</div>
	</div>
</main>
