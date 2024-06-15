<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Students from '$lib/components/admin/+Students.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="w-[80%]">
			<Students />
		</div>
	</div>
</main>
