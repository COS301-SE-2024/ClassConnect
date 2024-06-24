<script lang="ts">
	import { onMount } from 'svelte';
	import { type Call, type StreamVideoParticipant } from '@stream-io/video-client';

	import Participant from './Participant.svelte';
	import ScreenShare from './ScreenShare.svelte';

	export let call: Call;

	let participants: StreamVideoParticipant[] = [];

	import { screenShareEnabled } from '$lib/store/index';

	onMount(() => {
		const parentContainer = document.getElementById('participants');

		if (parentContainer) call.setViewport(parentContainer);

		call.state.participants$.subscribe((updatedParticipants) => {
			participants = updatedParticipants;
		});
	});

	function getParticipantClass(index: number): string {
		const total = participants.length;

		if (total === 1) {
			return 'w-full h-full';
		} else if (total === 2) {
			return 'w-1/2 h-full';
		} else if (total === 3) {
			return index === 0 ? 'w-1/2 h-1/2' : 'w-1/2 h-1/2';
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
	{#each participants as participant, index}
		<div class={`participant ${getParticipantClass(index)} flex items-center justify-center p-2`}>
			{#if showScreenShare}
				<ScreenShare {call} {participant} />
			{:else}
				<Participant {call} {participant} />
			{/if}
		</div>
	{/each}
</div>
