<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import Profile from '$lib/components/common/Profile.svelte';
	
</script>

<main>
	<Profile user={data.user_data} />
</main>
