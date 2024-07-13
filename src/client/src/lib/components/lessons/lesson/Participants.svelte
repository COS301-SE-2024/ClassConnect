<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Call, StreamVideoParticipant } from '@stream-io/video-client';

	import Participant from './Participant.svelte';

	let gridClass = '';
	let participants: StreamVideoParticipant[] = [];
	const callStore = getContext<Writable<Call | null>>('call');

	$: {
		$callStore?.state.participants$.subscribe((newParticipants) => {
			participants = newParticipants;
			updateGridClass(participants.length);
		});
	}

	function updateGridClass(count: number) {
		if (count <= 1) gridClass = 'grid-cols-1';
		else if (count <= 4) gridClass = 'grid-cols-2';
		else if (count <= 9) gridClass = 'grid-cols-3';
		else gridClass = 'grid-cols-4';
	}

	onMount(() => {
		updateGridClass(participants.length);
	});
</script>

<div class="h-full w-full bg-gray-100 p-4">
	<div class={`grid ${gridClass} h-full w-full gap-4`}>
		{#each participants as participant (participant.sessionId)}
			<Participant {participant} />
		{/each}
	</div>
</div>
