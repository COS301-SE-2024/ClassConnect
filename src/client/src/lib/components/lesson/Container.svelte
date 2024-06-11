<script lang="ts">
	import { onMount } from 'svelte';
	import { type Call, type StreamVideoParticipant } from '@stream-io/video-client';
	import Participant from './Participant.svelte';

	export let call: Call;

	let participants: StreamVideoParticipant[] = [];

	onMount(() => {
		const parentContainer = document.getElementById('participants');
		if (parentContainer && call) {
			call.setViewport(parentContainer);
			call.state.participants$.subscribe((updatedParticipants) => {
				participants = updatedParticipants;
			});
		}
	});
</script>

<div id="participants">
	{#each participants as participant}
		<Participant {call} {participant} />
	{/each}
</div>
