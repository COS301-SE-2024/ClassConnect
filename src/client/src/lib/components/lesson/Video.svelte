<script lang="ts">
	import { onMount } from 'svelte';
	import { Call, type StreamVideoParticipant } from '@stream-io/video-client';

	export let call: Call;
	export let participant: StreamVideoParticipant;

	let videoEl: HTMLVideoElement;

	onMount(() => {
		const unbind = call.bindVideoElement(videoEl, participant.sessionId, 'videoTrack');
		const untrack = call.trackElementVisibility(videoEl, participant.sessionId, 'videoTrack');

		return () => {
			if (unbind) unbind();
			untrack();
		};
	});
</script>

<div class="flex h-full w-full items-center justify-center">
	<video
		bind:this={videoEl}
		data-session-id={participant.sessionId}
		class="h-full w-full object-cover"
	>
		<track kind="captions" />
	</video>
</div>
