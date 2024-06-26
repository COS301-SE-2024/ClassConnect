<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import ModuleSideBar from '$lib/components/student/+ModuleSideBar.svelte';
	import TopBar from '$lib/components/universal/+TopBar.svelte';
	import Announcements from '$lib/components/universal/+Announcements.svelte';
</script>

<main>
	<div class="flex">
		<ModuleSideBar />
		<div class="flex-1">
			<TopBar />
			<Announcements announcements={data.announcements} />
		</div>
	</div>
</main>
