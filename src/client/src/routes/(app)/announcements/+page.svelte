<script lang="ts">
	import type { PageData } from './$types';
	import Announcements from '$lib/components/universal/+Announcements.svelte';

	export let data: PageData;
</script>

<Announcements announcements={data.announcements} />
