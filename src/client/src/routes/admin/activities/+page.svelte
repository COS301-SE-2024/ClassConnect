<script lang="ts">
	import SideBar from '$lib/components/utils/admin/+SideBar.svelte';
	import Activities from '$lib/components/universal/+Activities.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="flex-1">
			<TopBar />
			<div class="w-full bg-lightBgColor px-4 dark:bg-gray-800">
				<Activities />
			</div>
		</div>
	</div>
</main>
