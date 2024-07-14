<script lang="ts">
	import { writable } from 'svelte/store';
	import { onMount, onDestroy, setContext } from 'svelte';

	import type { Writable } from 'svelte/store';
	import type { Call } from '@stream-io/video-client';

	import Controls from './Controls.svelte';
	import Participants from './Layout.svelte';
	import AttendanceList from './AttendanceList.svelte';

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

{#if $callStore}
	<div class="flex h-screen">
		<AttendanceList />

		<div class="flex w-full flex-col items-center justify-center">
			<Participants />
			<Controls />
		</div>
	</div>
{:else}
	<div class="flex h-screen flex-grow items-center justify-center">
		<p class="text-lg font-semibold text-gray-800 dark:text-gray-200">Connecting...</p>
	</div>
{/if}
