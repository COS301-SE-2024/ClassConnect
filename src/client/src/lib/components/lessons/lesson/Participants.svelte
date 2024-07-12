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
		if (count <= 1) {
			gridClass = 'grid-cols-1';
		} else if (count <= 4) {
			gridClass = 'grid-cols-2';
		} else if (count <= 9) {
			gridClass = 'grid-cols-3';
		} else {
			gridClass = 'grid-cols-4';
		}
	}

	onMount(() => {
		updateGridClass(participants.length);
	});
</script>

<div class="flex h-full items-center justify-center bg-gray-100 p-4">
	<div class={`grid ${gridClass} max-h-[80vh] w-full max-w-6xl gap-4`}>
		{#each participants as participant (participant.sessionId)}
			<div class="max-w-100 aspect-video max-h-80">
				<Participant {participant} />
			</div>
		{/each}
	</div>
</div>
