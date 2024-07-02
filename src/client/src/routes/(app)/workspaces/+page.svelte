<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import SideBar from '$lib/components/utils/admin/+SideBar.svelte';
	import Workspaces from '$lib/components/admin/+Workspaces.svelte';
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
				<Workspaces workspaces={data.workspaces} />
			</div>
		</div>
	</div>
</main>
