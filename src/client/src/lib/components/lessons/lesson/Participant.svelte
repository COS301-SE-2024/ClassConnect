<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	import type { Writable } from 'svelte/store';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { MicrophoneSlashOutline } from 'flowbite-svelte-icons';
	import type { Call, StreamVideoParticipant } from '@stream-io/video-client';

	export let participant: StreamVideoParticipant;

	let videoElement: HTMLVideoElement;
	let audioElement: HTMLAudioElement;

	let unbindVideo: (() => void) | undefined;
	let unbindAudio: (() => void) | undefined;

	const callStore = getContext<Writable<Call | null>>('call');

	let isMuted = false;
	let isCameraOff = false;

	$: {
		$callStore?.microphone.state.status$.subscribe((status) => {
			isMuted = status === 'disabled' ? true : false;
		});
	}

	$: {
		$callStore?.camera.state.status$.subscribe((status) => {
			isCameraOff = status === 'disabled' ? true : false;
		});
	}

	onMount(() => {
		unbindVideo = $callStore?.bindVideoElement(videoElement, participant.sessionId, 'videoTrack');
		unbindAudio = $callStore?.bindAudioElement(audioElement, participant.sessionId);
	});

	onDestroy(() => {
		if (unbindVideo) unbindVideo();
		if (unbindAudio) unbindAudio();
	});
</script>

<div class="relative rounded-lg bg-gray-200 shadow-md">
	{#if !isCameraOff}
		<video
			bind:this={videoElement}
			autoplay
			playsinline
			muted={participant.isLocalParticipant}
			class="h-full w-full object-cover"
		/>
	{:else}
		<div class="h-full w-full bg-gray-300 p-4">
			<Avatar size="xl" src={participant.image} alt={participant.name} />
		</div>
	{/if}

	<audio bind:this={audioElement} autoplay playsinline />

	<div
		class="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black bg-opacity-50 p-2"
	>
		<p class="text-sm font-medium text-white">{participant.name || participant.sessionId}</p>

		{#if isMuted}
			<MicrophoneSlashOutline class="text-red-500" />
		{/if}
	</div>
</div>
