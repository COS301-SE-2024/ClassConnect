<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Activities from '$lib/components/admin/+Activities.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="w-full bg-lightBgColor px-4 dark:bg-gray-800">
			<Activities />
		</div>
	</div>
</main>
