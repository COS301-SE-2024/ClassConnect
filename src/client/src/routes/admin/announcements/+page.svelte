<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import SideBar from '$lib/components/utils/admin/+SideBar.svelte';
	import Announcements from '$lib/components/universal/+Announcements.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="flex-1 bg-lightBgColor dark:bg-gray-800">
			<TopBar />
			<Announcements announcements={data.announcements} />
		</div>
	</div>
</main>
