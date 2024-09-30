<script>
	import Announcements from '$src/lib/components/announcements/Main.svelte';
	import NoAccess from '$src/lib/components/common/PageUnavailable.svelte';
	export let data;
</script>

<!-- On the assumption each user has an organisation (besides admin) -->
{#if data.organisation === undefined}
	<NoAccess />
{:else}
	<Announcements {data} view={'admin'} />
{/if}
