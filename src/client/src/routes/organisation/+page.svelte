<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Organisation from '$lib/components/admin/+Organisation.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class=" w-full bg-lightBgColor dark:bg-gray-700">
			<Organisation />
		</div>
	</div>
</main>
