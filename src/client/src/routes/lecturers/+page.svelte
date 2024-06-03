<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Lecturers from '$lib/components/admin/+Lectures.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="w-[80%]">
			<Lecturers />
		</div>
	</div>
</main>
