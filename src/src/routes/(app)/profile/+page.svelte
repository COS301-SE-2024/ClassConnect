<script lang="ts">
	/** @type {import('./$types').PageData} */
	export let data;

	import Profile from '$lib/components/common/Profile.svelte';
	import Settings from '$lib/components/common/Settings.svelte';
	
</script>

<main>
	<Profile user={data.user_data} />
	<Settings user={data.user_data} />
</main>
