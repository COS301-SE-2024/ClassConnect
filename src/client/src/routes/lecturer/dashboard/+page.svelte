<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import SideBar from '$lib/components/utils/lecturer/+SideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Dashboard from '$lib/components/lecturer/+Dashboard.svelte';
</script>

<main>
	<div class="flex">
		<SideBar />
		<div class="flex-1">
			<TopBar />
			<div class="w-full p-2">
				<Dashboard files={data.files} />
			</div>
		</div>
	</div>
</main>
