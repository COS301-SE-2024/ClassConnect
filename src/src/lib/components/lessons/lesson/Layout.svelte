<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { hasScreenShare } from '@stream-io/video-client';

	import type { Writable } from 'svelte/store';
	import type { Call, StreamVideoParticipant } from '@stream-io/video-client';

	import Participant from './Participant.svelte';
	import ScreenShare from './ScreenShare.svelte';
	import Environment from './Environment.svelte';

	export let role: string;
	export let materials: any;

	let gridClass = '';
	let isEnvironmentOn = false;
	let participants: StreamVideoParticipant[] = [];
	let screenSharingParticipant: StreamVideoParticipant | null = null;

	const callStore = getContext<Writable<Call | null>>('call');

	$: {
		$callStore?.state.custom$.subscribe(({ environment }) => {
			isEnvironmentOn = environment;
		});
	}

	$: {
		$callStore?.state.participants$.subscribe((newParticipants) => {
			participants = newParticipants;
			screenSharingParticipant = newParticipants.find(hasScreenShare) || null;
			updateGridClass(participants.length);
		});
	}

	function updateGridClass(count: number) {
		if (count === 1) gridClass = 'grid-cols-1';
		else if (count === 2) gridClass = 'grid-cols-1 sm:grid-cols-2';
		else if (count <= 4) gridClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2';
		else if (count <= 6) gridClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3';
		else if (count <= 9) gridClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3';
		else gridClass = 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
	}

	onMount(() => {
		updateGridClass(participants.length);
	});
</script>

<div class="bg-gray h-full w-full p-4 dark:bg-gray-900">
	{#if isEnvironmentOn}
		<Environment {materials} {role} />
	{:else if screenSharingParticipant}
		<ScreenShare participant={screenSharingParticipant} />
	{:else}
		<div class={`grid ${gridClass} h-full w-full gap-4 md:grid-cols-${gridClass} grid-cols-1`}>
			{#each participants as participant (participant.sessionId)}
				<Participant {participant} />
			{/each}
		</div>
	{/if}
</div>
