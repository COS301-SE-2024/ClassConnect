<script lang="ts">
	import SideBar from '$lib/components/admin/+SideBar.svelte';
	import TopBar from '$lib/components/universal/+TopBar.svelte';
	import Contruction from '$lib/components/universal/+Construction.svelte';
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
