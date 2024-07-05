<script lang="ts">
	import SideBar from '$lib/components/utils/admin/+SideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Contruction from '$lib/components/common/Construction.svelte';
</script>

<main>
	<div class="flex">
		<SideBar />
		<div class="flex-1">
			<TopBar />
			<Contruction />
		</div>
	</div>
</main>
