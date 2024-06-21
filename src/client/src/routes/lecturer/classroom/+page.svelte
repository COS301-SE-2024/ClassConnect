<script lang="ts">
	import SideBar from '$lib/components/utils/lecturer/+SideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Lessons from '$lib/components/lecturer/+Lessons.svelte';
</script>

<main>
	<div class="flex">
		<SideBar />
		<div class="flex-1">
			<TopBar />
			<Lessons />
		</div>
	</div>
</main>
