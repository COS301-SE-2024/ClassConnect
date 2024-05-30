<script lang="ts">
	import SideBar from '$lib/components/utils/+SideBar.svelte';
	import Admins from '$lib/components/admin/+Admins.svelte';
</script>

<main>
	<div class="flex">
		<div>
			<SideBar />
		</div>
		<div class="w-[80%]">
			<Admins />
		</div>
	</div>
</main>
