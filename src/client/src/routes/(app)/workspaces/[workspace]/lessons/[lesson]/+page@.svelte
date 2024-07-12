<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Call } from '@stream-io/video-client';
	import { StreamVideoClient } from '@stream-io/video-client';

	import Room from '$lib/components/lessons/lesson/Room.svelte';
	import Preview from '$lib/components/lessons/lesson/Preview.svelte';

	export let data: any;

	let call: Call;
	let client: StreamVideoClient;

	let showPreview = true;
	let callId = $page.params.lesson;

	let { apiKey, token, user } = data;

	onMount(() => (client = new StreamVideoClient({ apiKey, token, user })));

	function handleJoin(audio: boolean, video: boolean) {
		showPreview = false;

		call = client.call('default', callId);

		console.log('handleJoin', audio, video);

		if (video) call.camera.enable();
		else call.camera.disable();

		if (audio) call.microphone.enable();
		else call.microphone.disable();
	}
</script>

{#if showPreview}
	<Preview onJoin={handleJoin} />
{:else}
	<Room {call} />
{/if}
