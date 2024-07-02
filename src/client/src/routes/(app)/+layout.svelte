<script lang="ts">
	import type { LayoutData } from './$types';
	import Header from '$lib/components/common/Header.svelte';
	import SideBar from '$lib/components/common/SideBar.svelte';

	export let data: LayoutData;
</script>

<div class="flex">
	<SideBar role={data.role} />

	<div class="flex-1">
		<Header {data} />

		<div class="m-2">
			<slot />
		</div>
	</div>
</div>
