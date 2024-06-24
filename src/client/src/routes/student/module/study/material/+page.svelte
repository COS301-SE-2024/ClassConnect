<script lang="ts">
	import ModuleSideBar from '$lib/components/utils/student/+ModuleSideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Material from '$lib/components/student/+Material.svelte';
</script>

<main>
	<div class="flex">
		<ModuleSideBar />
		<div class="flex-1">
			<TopBar />
			<Material />
		</div>
	</div>
</main>
