<script lang="ts">
	import Sandbox from '$src/lib/components/common/Sandbox.svelte';
	import { onMount } from 'svelte';
	export let data: any;
	let items: any[] = [];

	onMount(() => {
		items = data.materials;
	});
</script>

<main>
	<Sandbox {items} />
</main>
