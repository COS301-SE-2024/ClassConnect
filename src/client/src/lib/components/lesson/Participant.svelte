<script lang="ts">
	import { Call, type StreamVideoParticipant } from '@stream-io/video-client';
	import Video from './Video.svelte';
	import Audio from './Audio.svelte';

	export let call: Call;
	export let participant: StreamVideoParticipant;
</script>

<div class="flex h-full w-full items-center justify-center rounded-lg bg-gray-300 dark:bg-gray-400">
	<Video {call} {participant} />
	<Audio {call} {participant} />
</div>
