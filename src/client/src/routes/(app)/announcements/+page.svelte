<script>
	import Announcements from '$src/lib/components/announcements/Main.svelte';

	export let data;
</script>

<Announcements {data} view={'admin'} />
