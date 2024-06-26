<script lang="ts">
	import SideBar from '$lib/components/lecturer/+SideBar.svelte';
	import TopBar from '$lib/components/universal/+TopBar.svelte';
	import Material from '$lib/components/student/+Material.svelte';
</script>

<main>
	<div class="flex">
		<SideBar />
		<div class="flex-1">
			<TopBar />
			<Material />
		</div>
	</div>
</main>
