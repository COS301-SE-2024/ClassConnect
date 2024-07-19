<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { StreamChat } from 'stream-chat';
	import { StreamVideoClient } from '@stream-io/video-client';

	import type { Channel } from 'stream-chat';
	import type { Call } from '@stream-io/video-client';

	import Room from '$lib/components/lessons/lesson/Room.svelte';
	import Preview from '$lib/components/lessons/lesson/Preview.svelte';

	export let data: any;

	let call: Call;
	let channel: Channel;
	let chatClient: StreamChat;
	let videoClient: StreamVideoClient;

	let showPreview = true;
	let callId = $page.params.lesson;

	let { apiKey, token, user, role } = data;

	onMount(() => {
		chatClient = StreamChat.getInstance(apiKey);
		videoClient = new StreamVideoClient({ apiKey, token, user });
	});

	async function handleJoin(audio: boolean, video: boolean) {
		showPreview = false;

		call = videoClient.call('default', callId);

		await chatClient.connectUser(user, token);
		channel = chatClient.channel('livestream', callId);
		await channel.create();

		if (video) call.camera.enable();
		else call.camera.disable();

		if (audio) call.microphone.enable();
		else call.microphone.disable();
	}
</script>

{#if showPreview}
	<Preview onJoin={handleJoin} />
{:else}
	<Room {call} {channel} {role} />
{/if}
