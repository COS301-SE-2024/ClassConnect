<script lang="ts">
	import SideBar from '$lib/components/utils/lecturer/+SideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Activities from '$lib/components/lecturer/+LecturerFAQ.svelte';
</script>

<main>
	<div class="flex">
		<SideBar />
		<div class="flex-1">
			<TopBar />
			<div class="w-full bg-lightBgColor px-4 dark:bg-gray-800">
				<Activities />
			</div>
		</div>
	</div>
</main>
