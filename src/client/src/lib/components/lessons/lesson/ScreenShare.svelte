<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import { Call, type StreamVideoParticipant } from '@stream-io/video-client';

	export let participant: StreamVideoParticipant;

	const callStore = getContext<Writable<Call | null>>('call');

	let videoEl: HTMLVideoElement;

	onMount(() => {
		const unbind = $callStore?.bindVideoElement(videoEl, participant.sessionId, 'screenShareTrack');
		const untrack = $callStore?.trackElementVisibility(
			videoEl,
			participant.sessionId,
			'screenShareTrack'
		);

		return () => {
			if (unbind) unbind();
			if (untrack) untrack();
		};
	});
</script>

<div class="h-full w-full">
	<video
		bind:this={videoEl}
		data-session-id={participant.sessionId}
		class="h-full w-full object-cover"
	>
		<track kind="captions" />
	</video>
</div>
