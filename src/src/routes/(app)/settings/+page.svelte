<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import Settings from '$lib/components/common/Settings.svelte';
</script>

<main>
	<Settings user={data.user_data} />
</main>
