<script lang="ts">
	import { Avatar, Badge } from 'flowbite-svelte';
	import { hasAudio, hasVideo } from '@stream-io/video-client';
	import { MicrophoneSlashSolid } from 'flowbite-svelte-icons';
	import { onMount, onDestroy, getContext, afterUpdate } from 'svelte';

	import type { Writable } from 'svelte/store';
	import type { Call, StreamVideoParticipant } from '@stream-io/video-client';

	export let participant: StreamVideoParticipant;

	let isMuted = false;
	let isVideoOff = false;

	let videoElement: HTMLVideoElement;
	let audioElement: HTMLAudioElement;

	let unbindVideo: (() => void) | undefined;
	let unbindAudio: (() => void) | undefined;
	let untrackVideo: (() => void) | undefined;

	// Access the shared call store from context
	const callStore = getContext<Writable<Call | null>>('call');

	function bindVideo() {
		if (!callStore) return;

		// Unbind previous video/audio streams if necessary
		if (unbindVideo) unbindVideo();
		if (untrackVideo) untrackVideo();

		// Bind video element for the participant
		unbindVideo = $callStore?.bindVideoElement(videoElement, participant.sessionId, 'videoTrack');
		untrackVideo = $callStore?.trackElementVisibility(
			videoElement,
			participant.sessionId,
			'videoTrack'
		);
	}

	// Bind video/audio elements on mount
	onMount(() => {
		if (!callStore) return;

		bindVideo();
		unbindAudio = $callStore?.bindAudioElement(audioElement, participant.sessionId);

		// Subscribe to changes in participant audio/video state
		const subscription = $callStore?.state.participants$.subscribe(() => {
			isMuted = !hasAudio(participant);
			isVideoOff = !hasVideo(participant);
		});

		return () => {
			if (subscription) subscription.unsubscribe();
		};
	});

	// Update video element after changes
	afterUpdate(() => {
		if (!isVideoOff && videoElement) {
			bindVideo();
		}
	});

	// Clean up resources on component destruction
	onDestroy(() => {
		if (unbindVideo) unbindVideo();
		if (unbindAudio) unbindAudio();
		if (untrackVideo) untrackVideo();
	});
</script>

<!-- HTML for Participant Video Display -->
<div
	class="relative h-full w-full overflow-hidden rounded-lg bg-gray-500 shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800"
>
	{#if isVideoOff}
		<!-- Show Avatar if video is off -->
		<div
			class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"
		>
			<Avatar
				size="xl"
				src={participant.image}
				alt={participant.name}
				class="ring-4 ring-white dark:ring-gray-900"
			/>
		</div>
	{:else}
		<!-- Show Video Element -->
		<video
			bind:this={videoElement}
			autoplay
			playsinline
			muted={participant.isLocalParticipant}
			class="absolute inset-0 h-full w-full object-cover"
		/>
	{/if}

	<!-- Audio Element -->
	<audio bind:this={audioElement} autoplay playsinline />

	<!-- Participant Info -->
	<div
		class="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t p-3"
	>
		<div class="flex items-center space-x-2">
			<Badge large color="dark" class="px-2 py-1 font-semibold ">
				{participant.name}
			</Badge>
		</div>

		<!-- Mute Icon if Participant is Muted -->
		<div class="flex space-x-2">
			{#if isMuted}
				<div class="rounded-full bg-red-700 p-1">
					<MicrophoneSlashSolid class="h-5 w-5 text-white" />
				</div>
			{/if}
		</div>
	</div>
</div>
