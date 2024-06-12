<script lang="ts">
	import ModuleSideBar from '$lib/components/utils/+ModuleSideBar.svelte';
	import Home from '$lib/components/student/+Home.svelte'
	import TopBar from '$lib/components/utils/+TopBar.svelte';
</script>

<main>
	<div class="flex">
		<ModuleSideBar />
		<div class="flex-1">
			<TopBar />
			<Home />
		</div>
	</div>
</main>
