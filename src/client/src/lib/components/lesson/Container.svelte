<script lang="ts">
	import { onMount } from 'svelte';
	import { type Call, type StreamVideoParticipant } from '@stream-io/video-client';

	import Participant from './Participant.svelte';
	import ScreenShare from './ScreenShare.svelte';

	export let call: Call;

	let participants: StreamVideoParticipant[] = [];

	onMount(() => {
		const parentContainer = document.getElementById('participants');

		if (parentContainer) call.setViewport(parentContainer);

		call.state.participants$.subscribe((updatedParticipants) => {
			participants = updatedParticipants;
		});
	});
</script>

<div id="participants" class="flex">
	{#each participants as participant}
		<Participant {call} {participant} />
		<ScreenShare {call} {participant} />
	{/each}
</div>
