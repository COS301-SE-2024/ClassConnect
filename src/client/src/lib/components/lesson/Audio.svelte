<script lang="ts">
	import { onMount } from 'svelte';
	import { Call, type StreamVideoParticipant } from '@stream-io/video-client';

	export let call: Call;
	export let participant: StreamVideoParticipant;

	let audioEl: HTMLAudioElement;

	onMount(() => {
		if (participant.isLocalParticipant) return;

		const unbind = call.bindAudioElement(audioEl, participant.sessionId);

		return () => {
			if (unbind) unbind();
		};
	});
</script>

{#if !participant.isLocalParticipant}
	<audio bind:this={audioEl} data-session-id={participant.sessionId}></audio>
{/if}
