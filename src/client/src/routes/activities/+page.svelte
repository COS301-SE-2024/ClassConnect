<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Activities from '$lib/components/admin/+Activities.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="w-full bg-lightBgColor dark:bg-gray-800 px-4">
			<Activities />
		</div>
	</div>
</main>
