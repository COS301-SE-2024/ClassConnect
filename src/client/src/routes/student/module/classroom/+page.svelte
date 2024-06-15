<script lang="ts">
	import ModuleSideBar from '$lib/components/utils/student/+ModuleSideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Contruction from '$lib/components/universal/+Construction.svelte'
</script>

<main>
	<div class="flex">
		<ModuleSideBar />
		<div class="flex-1">
			<TopBar />
			<Contruction />
		</div>
	</div>
</main>