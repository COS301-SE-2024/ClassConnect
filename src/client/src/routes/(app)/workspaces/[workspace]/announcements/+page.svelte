<script lang="ts">
	import type { PageData } from './$types';
	import Announcements from '$src/lib/components/announcements/Main.svelte';

	export let data: PageData;
</script>

<Announcements announcements={data.announcements} />
