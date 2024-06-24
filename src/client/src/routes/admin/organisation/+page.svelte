<script lang="ts">
	import SideBar from '$lib/components/utils/admin/+SideBar.svelte';
	import Organisation from '$lib/components/admin/+Organisation.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="flex-1">
			<TopBar />
			<div class="w-full bg-lightBgColor p-2 dark:bg-gray-700">
				<Organisation />
			</div>
		</div>
	</div>
</main>
