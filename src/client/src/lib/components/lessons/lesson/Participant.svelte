<script lang="ts">
	import { Avatar } from 'flowbite-svelte';
	import { onMount, onDestroy, getContext } from 'svelte';
	import { hasAudio, hasVideo } from '@stream-io/video-client';
	import { MicrophoneSlashOutline } from 'flowbite-svelte-icons';

	import type { Writable } from 'svelte/store';
	import type { Call, StreamVideoParticipant } from '@stream-io/video-client';

	export let participant: StreamVideoParticipant;

	let isMuted = false;
	let isVideoOff = false;

	let videoElement: HTMLVideoElement;
	let audioElement: HTMLAudioElement;

	let unbindVideo: (() => void) | undefined;
	let unbindAudio: (() => void) | undefined;

	const callStore = getContext<Writable<Call | null>>('call');

	onMount(() => {
		unbindVideo = $callStore?.bindVideoElement(videoElement, participant.sessionId, 'videoTrack');
		unbindAudio = $callStore?.bindAudioElement(audioElement, participant.sessionId);

		const subscription = $callStore?.state.participants$.subscribe(() => {
			isMuted = !hasAudio(participant);
			isVideoOff = !hasVideo(participant);
		});

		return () => {
			if (subscription) subscription.unsubscribe();
		};
	});

	onDestroy(() => {
		if (unbindVideo) unbindVideo();
		if (unbindAudio) unbindAudio();
	});
</script>

<div class="relative h-full w-full overflow-hidden rounded-lg bg-gray-200 shadow-md">
	{#if isVideoOff}
		<div class="absolute inset-0 flex items-center justify-center bg-gray-300">
			<Avatar size="xl" src={participant.image} alt={participant.name} />
		</div>
	{:else}
		<video
			bind:this={videoElement}
			autoplay
			playsinline
			muted={participant.isLocalParticipant}
			class="absolute inset-0 h-full w-full object-cover"
		/>
	{/if}

	<audio bind:this={audioElement} autoplay playsinline />

	<div
		class="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black bg-opacity-50 p-2"
	>
		<p class="text-sm font-medium text-white">{participant.name}</p>
		
		<div class="flex space-x-2">
			{#if isMuted}
				<MicrophoneSlashOutline color="red" />
			{/if}
		</div>
	</div>
</div>
