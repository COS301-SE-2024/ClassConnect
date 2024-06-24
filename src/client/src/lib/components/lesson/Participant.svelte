<script lang="ts">
	import { Call, type StreamVideoParticipant } from '@stream-io/video-client';
	import Video from './Video.svelte';
	import Audio from './Audio.svelte';

	export let call: Call;
	export let participant: StreamVideoParticipant;
</script>

<div class="w-full h-full bg-gray-300 dark:bg-gray-400 flex items-center rounded-lg justify-center">
	<Video {call} {participant} />
	<Audio {call} {participant} />
</div>