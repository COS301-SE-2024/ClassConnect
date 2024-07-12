<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, onDestroy, setContext } from 'svelte';

	import type { Writable } from 'svelte/store';
	import type { Call } from '@stream-io/video-client';

	import Controls from './Controls.svelte';
	import Participants from './Participants.svelte';

	export let call: Call;
	const callStore: Writable<Call | null> = writable(null);

	onMount(async () => {
		await call.join({ create: true });
		callStore.set(call);
	});

	onDestroy(() => {
		if (call) call.leave();
	});

	setContext('call', callStore);
</script>

<div class="flex h-screen w-full flex-col items-center justify-center bg-gray-100">
	{#if $callStore}
		<Participants />
		<Controls />
	{:else}
		<div class="flex flex-grow items-center justify-center"><p>Connecting...</p></div>
	{/if}
</div>
