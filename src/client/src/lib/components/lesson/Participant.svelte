<script lang="ts">
	import { Call, type StreamVideoParticipant } from '@stream-io/video-client';
	import Video from './Video.svelte';
	import Audio from './Audio.svelte';

	export let call: Call;
	export let participant: StreamVideoParticipant;
</script>

<div class="m-5 bg-gray-200">
	<Video {call} {participant} />
	<Audio {call} {participant} />
</div>
