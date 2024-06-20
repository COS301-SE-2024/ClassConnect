<script lang="ts">
	import { type Call } from '@stream-io/video-client';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { MicrophoneOutline, MicrophoneSlashOutline, VideoCameraOutline, ArrowUpFromBracketOutline, PhoneHangupOutline } from 'flowbite-svelte-icons';
	import {writable} from 'svelte/store';

	export let call: Call;

	const microphoneEnabled = writable(false);

	function toggleMicrophone() {
		call.microphone.toggle();
		microphoneEnabled.update(enabled => !enabled);
	}

	function toggleCamera() {
		call.camera.toggle();
	}

	function toggleScreenShare() {
		call.screenShare.toggle();
	}

	function endCall() {
		call.leave();
		goto('/lessons');
	}
</script>

<div class="flex space-x-2">
	<Button pill={true} on:click={toggleMicrophone} class="bg-blue-500 text-white hover:bg-blue-700">
		{#if $microphoneEnabled}
			<MicrophoneOutline class="h-6 w-6" />
		{:else}
			<MicrophoneSlashOutline class="h-6 w-6" />
		{/if}
	</Button>

	<Button pill={true} on:click={toggleCamera} class="bg-blue-500 text-white hover:bg-blue-700">
		<VideoCameraOutline class="h-6 w-6" />
	</Button>

	<Button pill={true} on:click={toggleScreenShare} class="bg-blue-500 text-white hover:bg-blue-700">
		<ArrowUpFromBracketOutline class="h-6 w-6" />
	</Button>

	<Button pill={true} on:click={endCall} class="bg-red-500 text-white hover:bg-red-700 dark:bg-red-500 dark:text-white dark:hover:bg-red-700">
		<PhoneHangupOutline class="h-6 w-6" />
	</Button>
</div>
