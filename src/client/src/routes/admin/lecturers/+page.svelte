<script lang="ts">
	import SideBar from '$lib/components/utils/admin/+SideBar.svelte';
	import Lecturers from '$lib/components/admin/+Lectures.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="flex-1">
			<TopBar />
			<div class="w-[80%]">
				<Lecturers />
			</div>
		</div>
	</div>
</main>
