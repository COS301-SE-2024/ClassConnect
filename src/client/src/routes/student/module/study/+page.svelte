<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import ModuleSideBar from '$lib/components/utils/student/+ModuleSideBar.svelte';
	import TopBar from '$lib/components/utils/+TopBar.svelte';
	import Study from '$lib/components/student/+Study.svelte'

</script>

<main>
	<div class="flex">
		<ModuleSideBar />
		<div class="flex-1">
			<TopBar />
			<Study materials={data.materials} />
		</div>
	</div>
</main>