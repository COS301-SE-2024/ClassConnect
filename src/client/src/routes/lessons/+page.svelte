<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Lessons from '$lib/components/admin/+Lessons.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="w-[80%]">
			<Lessons />
		</div>
	</div>
</main>
