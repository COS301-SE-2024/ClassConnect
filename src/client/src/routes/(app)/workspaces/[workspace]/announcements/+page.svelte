<script lang="ts">
	import type { PageData } from './$types';
	import Announcements from '$lib/components/common/announcements/Main.svelte';

	export let data: PageData;
</script>

<Announcements announcements={data.announcements} />
