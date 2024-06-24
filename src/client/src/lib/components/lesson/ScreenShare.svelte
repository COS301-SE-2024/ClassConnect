<script lang="ts">
    import { onMount } from 'svelte';
    import { Call, type StreamVideoParticipant } from '@stream-io/video-client';

    export let call: Call;
    export let participant: StreamVideoParticipant;

    let videoEl: HTMLVideoElement;

    onMount(() => {
        const unbind = call.bindVideoElement(videoEl, participant.sessionId, 'screenShareTrack');
        const untrack = call.trackElementVisibility(videoEl, participant.sessionId, 'screenShareTrack');

        return () => {
            if (unbind) unbind();
            untrack();
        };
    });
</script>

<div class="w-full h-full flex items-center justify-center">
    <video bind:this={videoEl} data-session-id={participant.sessionId} class="w-full h-full object-contain">
        <track kind="captions" />
    </video>
</div>