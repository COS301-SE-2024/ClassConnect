<script lang="ts">
	import SideBar from '$lib/components/utils/admin/+SideBar.svelte';
	import Admins from '$lib/components/admin/+Admins.svelte';
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
				<Admins />
			</div>
		</div>
	</div>
</main>
