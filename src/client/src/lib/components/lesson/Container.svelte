<script lang="ts">
	import { onMount } from 'svelte';
	import { type Call, type StreamVideoParticipant,hasAudio, hasVideo } from '@stream-io/video-client';

	import Participant from './Participant.svelte';
	import ScreenShare from './ScreenShare.svelte';
	import { screenShareEnabled } from '$lib/store/index';
	import { participantsThere, participantsCount } from '$lib/store/index';

	export let call: Call;


	onMount(() => {
		const parentContainer = document.getElementById('participants');

		if (parentContainer) call.setViewport(parentContainer);

		const subscription = call.state.participants$.subscribe((updatedParticipants) => {
			participantsThere.set(updatedParticipants);
		});

		return () => {
			subscription.unsubscribe();
		};
	});

	function getParticipantClass(index: number, total: number): string {
		if (total === 1) {
			return 'w-full h-full';
		} else if (total === 2) {
			return 'w-1/2 h-full';
		} else if (total === 3) {
			return index === 0 ? 'w-full h-1/2' : 'w-1/2 h-1/2';
		} else if (total === 4) {
			return 'w-1/2 h-1/2';
		} else if (total <= 6) {
			return 'w-1/3 h-1/2';
		} else {
			return 'w-1/4 h-1/4';
		}
	}


	let showScreenShare: boolean;

	screenShareEnabled.subscribe((value: boolean) => {
		showScreenShare = value;
	});


</script>

<div id="participants" class="flex h-full flex-wrap justify-center">
	{#each $participantsThere as participant, index}
	{#if showScreenShare}
	<div class={`participant w-full h-full flex items-center justify-center p-2`}>
		<ScreenShare {call} {participant} />
	</div>
			{:else}
			<div class={`participant ${getParticipantClass(index, $participantsCount)} flex items-center justify-center p-2`}>
				{#if hasVideo(participant)}
				<Participant {call} {participant} />
				{:else}
				<div class="flex h-full w-full items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-400"></div>
				{/if}
			</div>
			{/if}
	{/each}
</div>
