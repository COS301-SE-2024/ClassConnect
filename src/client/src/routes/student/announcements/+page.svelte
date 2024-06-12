<script lang="ts">
	import ModuleSideBar from '$lib/components/utils/+ModuleSideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Announcements from '$lib/components/admin/+Announcements.svelte';
</script>

<main>
	<div class="flex">
		<ModuleSideBar />
		<div class="flex-1">
			<TopBar />
			<Announcements />
		</div>
	</div>
</main>
