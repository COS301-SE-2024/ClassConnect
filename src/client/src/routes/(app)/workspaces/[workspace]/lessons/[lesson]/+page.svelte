<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { StreamVideoClient } from '@stream-io/video-client';

	import Room from '$lib/components/lessons/lesson/Room.svelte';
	import Preview from '$lib/components/lessons/lesson/Preview.svelte';

	export let data: any;

	let showPreview = true;
	let client: StreamVideoClient;
	let callId = $page.params.lesson;

	let { apiKey, token, user } = data;

	onMount(() => (client = new StreamVideoClient({ apiKey, token, user })));
</script>

{#if showPreview}
	<Preview {client} onJoin={() => (showPreview = false)} />
{:else}
	<Room />
{/if}
