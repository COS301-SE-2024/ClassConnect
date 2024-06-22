<script lang="ts">
	import { Call, type StreamVideoParticipant } from '@stream-io/video-client';
	import Video from './Video.svelte';
	import Audio from './Audio.svelte';

	export let call: Call;
	export let participant: StreamVideoParticipant;
</script>

<div class="w-full h-full bg-gray-200 flex items-center justify-center">
	<Video {call} {participant} />
	<Audio {call} {participant} />
</div>
