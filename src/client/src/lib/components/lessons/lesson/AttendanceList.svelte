<script lang="ts">
	import { onMount, getContext } from 'svelte';
	import { Call, hasAudio, hasVideo } from '@stream-io/video-client';
	import { Listgroup, ListgroupItem, Avatar } from 'flowbite-svelte';
	import {
		MicrophoneSolid,
		VideoCameraSolid,
		VideoCameraOutline,
		MicrophoneSlashOutline
	} from 'flowbite-svelte-icons';

	import type { Writable } from 'svelte/store';
	import type { StreamVideoParticipant } from '@stream-io/video-client';

	let participants: StreamVideoParticipant[] = [];
	const callStore = getContext<Writable<Call | null>>('call');

	onMount(() => {
		const subscription = $callStore?.state.participants$.subscribe((newParticipants) => {
			participants = newParticipants;
		});

		return () => {
			if (subscription) subscription.unsubscribe();
		};
	});
</script>

<Listgroup active class="m-4 w-1/6 p-4">
	<h2 class="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
		Participants ({participants.length})
	</h2>

	{#each participants as participant (participant.sessionId)}
		<ListgroupItem class="gap-2 text-base font-semibold">
			<Avatar src={participant.image} size="xs" />

			<p class="text-sm text-gray-500">{participant.name}</p>

			<div class="ml-auto flex space-x-2">
				{#if hasAudio(participant)}
					<MicrophoneSolid color="green" />
				{:else}
					<MicrophoneSlashOutline color="red" />
				{/if}

				{#if hasVideo(participant)}
					<VideoCameraSolid color="green" />
				{:else}
					<VideoCameraOutline color="red" />
				{/if}
			</div>
		</ListgroupItem>
	{/each}
</Listgroup>
