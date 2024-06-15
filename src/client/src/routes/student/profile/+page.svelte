<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Profile from '$lib/components/admin/+Profile.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="w-full bg-lightBgColor">
			<Profile />
		</div>
	</div>
</main>
