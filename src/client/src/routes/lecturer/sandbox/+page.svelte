<script lang="ts">
	import SideBar from '$lib/components/lecturer/+SideBar.svelte';
	import TopBar from '$lib/components/universal/+TopBar.svelte';
	import SandBox from '$lib/components/universal/+SandBox.svelte';
</script>

<main>
	<div class="flex">
		<SideBar />
		<div class="flex-1">
			<TopBar />
			<SandBox />
		</div>
	</div>
</main>
