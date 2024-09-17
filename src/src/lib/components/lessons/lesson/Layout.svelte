<!--
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

	let showMenu = false; // Controls the hamburger menu visibility
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
		if (count <= 1) gridClass = 'grid-cols-1';
		else if (count <= 4) gridClass = 'grid-cols-2';
		else if (count <= 9) gridClass = 'grid-cols-3';
		else gridClass = 'grid-cols-4';
	}

	function toggleMenu() {
		showMenu = !showMenu;
	}

	onMount(() => {
		updateGridClass(participants.length);
	});
</script>

<div class="h-full w-full bg-gray-100 p-4 dark:bg-gray-700">
	<div class="lg:hidden">
		<button 
			class="p-2 text-white bg-blue-600 rounded-lg focus:outline-none"
			on:click={toggleMenu}>
			{#if showMenu} Close Menu {/if} {#if !showMenu} Open Menu {/if}
		</button>
		{#if showMenu}
			<div class="p-4 mt-2 space-y-4 bg-gray-800 text-white rounded-lg">
				<p>Participants: {participants.length}</p>
			</div>
		{/if}
	</div>

	{#if isEnvironmentOn}
		<Environment {materials} {role} />
	{:else if screenSharingParticipant}
		<ScreenShare participant={screenSharingParticipant} />
	{:else}
		<div class={`grid ${gridClass} h-full w-full gap-4 dark:bg-gray-900`}>
			{#each participants as participant (participant.sessionId)}
				<Participant {participant} />
			{/each}
		</div>
	{/if}
</div>

<style>
	/* Adjust grid and layout based on screen size */
	@media (max-width: 640px) {
		.grid-cols-1 {
			grid-template-columns: 1fr;
		}
		.grid-cols-2 {
			grid-template-columns: 1fr 1fr;
		}
		.grid-cols-3 {
			grid-template-columns: 1fr 1fr 1fr;
		}
		.grid-cols-4 {
			grid-template-columns: 1fr 1fr 1fr 1fr;
		}
	}
</style>
-->
