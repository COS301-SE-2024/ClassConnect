<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Announcements from '$lib/components/admin/+Announcements.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class=" bg-lightBgColor dark:bg-gray-800">
			<Announcements />
		</div>
	</div>
</main>
