<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { Call, hasAudio, hasVideo } from '@stream-io/video-client';
	import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
	import {
		MicrophoneSolid,
		VideoCameraSolid,
		VideoCameraOutline,
		MicrophoneSlashSolid
	} from 'flowbite-svelte-icons';

	import type { Writable } from 'svelte/store';
	import type { StreamVideoParticipant } from '@stream-io/video-client';

	let participants: StreamVideoParticipant[] = [];
	const callStore = getContext<Writable<Call | null>>('call');

	onMount(() => {
		const subscription = $callStore?.state.participants$.subscribe((newParticipants) => {
			participants = newParticipants;
			console.log(participants);
		});

		return () => {
			if (subscription) subscription.unsubscribe();
		};
	});
</script>

<Listgroup class="h-dvh rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
	<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
		Participants ({participants.length})
	</h2>

	{#each participants as participant (participant.sessionId)}
		<ListgroupItem class="flex items-center gap-4 text-base font-semibold">
			<Avatar src={participant.image} size="sm" class="shadow-md" />

			<div class="flex flex-col">
				<p class="text-gray-900 dark:text-gray-200">{participant.name}</p>
			</div>

			<div class="ml-auto flex space-x-2">
				{#if hasAudio(participant)}
					<MicrophoneSolid class="text-green-500" />
				{:else}
					<MicrophoneSlashSolid class="text-red-500" />
				{/if}

				{#if hasVideo(participant)}
					<VideoCameraSolid class="text-green-500" />
				{:else}
					<VideoCameraOutline class="text-red-500" />
				{/if}
			</div>
		</ListgroupItem>
	{/each}
</Listgroup>
