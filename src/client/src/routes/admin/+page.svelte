<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Overview from '$lib/components/admin/+Overview.svelte';
	import LeftSidePanel from '$lib/components/admin/+LeftSidePanel.svelte';
</script>

<main>
	<div class="flex">
		<div class="w-[10%]">
			<SideBar />
		</div>
		<div class="w-[70%]">
			<Overview />
		</div>
		<div class="w-[20%]">
			<LeftSidePanel />
		</div>
	</div>
</main>
