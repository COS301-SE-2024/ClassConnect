<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import { role } from '$lib/store/user';
	import SideBar from '$lib/components/utils/lecturer/+SideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Announcements from '$lib/components/universal/+Announcements.svelte';

	if ($role !== 'lecturer') {
		location.href = '/signin';
	}
</script>

<main>
	<div class="flex">
		<SideBar />
		<div class="flex-1">
			<TopBar />
			<Announcements announcements={data.announcements} />
		</div>
	</div>
</main>
