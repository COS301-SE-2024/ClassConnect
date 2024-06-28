<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import { role } from '$lib/store/user';
	import SideBar from '$lib/components/utils/admin/+SideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Degrees from '$lib/components/admin/+Degrees.svelte';

	console.log($role);

	if ($role !== 'admin') {
		//location.href = '/signin';
	}
</script>

<main class="flex">
	<div>
		<SideBar />
	</div>
	<div class="flex-1">
		<TopBar />
		<div class="mt-4 p-2">
			<Degrees degrees={data.degrees} />
		</div>
	</div>
</main>
