<script lang="ts">
	import { writable } from 'svelte/store';
	import type { Channel } from 'stream-chat';
	import { onMount, onDestroy, setContext } from 'svelte';

	import type { Writable } from 'svelte/store';
	import type { Call } from '@stream-io/video-client';

	import Chat from './Chat.svelte';
	import Controls from './Controls.svelte';
	import Participants from './Layout.svelte';

	export let call: Call;
	export let role: string;
	export let channel: Channel;
	export let materials: any;
	const callStore: Writable<Call | null> = writable(null);

	onMount(async () => {
		await call.join({ create: true, data: { custom: { environment: false } } });
		callStore.set(call);
	});

	onDestroy(() => {
		if (call) {
			call.leave();
			call.update({ custom: { environment: false } });
		}

		if (channel) channel.stopWatching();
	});

	setContext('call', callStore);
</script>

{#if $callStore}
	<div class="flex h-screen">
		<div class="flex w-3/4 flex-col items-center justify-center">
			<Participants {materials} {role} />
			<Controls {role} />
		</div>

		<div class="w-1/4 p-4">
			<Chat {channel} />
		</div>
	</div>
{:else}
	<div class="flex h-screen flex-grow items-center justify-center">
		<p class="text-lg font-semibold text-gray-800 dark:text-gray-200">Connecting...</p>
	</div>
{/if}
