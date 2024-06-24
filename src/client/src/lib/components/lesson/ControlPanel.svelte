<script lang="ts">
	import { type Call } from '@stream-io/video-client';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import { MicrophoneOutline, MicrophoneSlashOutline, VideoCameraOutline, ArrowUpFromBracketOutline, PhoneHangupOutline } from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';
	import {screenShareEnabled} from '$lib/store/index'

	export let call: Call;

	const microphoneEnabled = writable(false);
	const cameraEnabled = writable(false);
	
	let screenShare
	screenShareEnabled.subscribe((value:boolean) => {
		screenShare = value
	});

	function toggleMicrophone() {
		call.microphone.toggle();
		microphoneEnabled.update(enabled => !enabled);
	}

	function toggleCamera() {
		call.camera.toggle();
	}

	function toggleScreenShare() {
		call.screenShare.toggle();
		screenShareEnabled.update(enabled => !enabled);
	}

	function endCall() {
		call.leave();
		goto('/lessons');
	}
</script>

<div class="flex justify-around items-center h-full bg-gray-300 dark:bg-gray-800 p-4">

		{#if $microphoneEnabled}
		<Button pill={true} on:click={toggleMicrophone} class="bg-green-500 text-white hover:bg-green-700">
			<MicrophoneOutline class="h-6 w-6" />
		</Button>
		{:else}
		<Button pill={true} on:click={toggleMicrophone} class="bg-green-500 text-white hover:bg-green-700">
			<MicrophoneSlashOutline class="h-6 w-6" />
		</Button>
		{/if}



	{#if $cameraEnabled}
		<Button pill={true} on:click={toggleCamera} class="bg-green-500 dark:bg-green-500 dark:hover:bg-green-700 text-white hover:bg-green-700">
			<VideoCameraOutline class="h-6 w-6" />
		</Button>
	{:else}
		<Button pill={true} on:click={toggleCamera} class="bg-gray-500  text-white dark:hover:bg-gray-700  hover:bg-gray-700  dark:bg-gray-500">
			<VideoCameraOutline class="h-6 w-6" />
		</Button>
	{/if}
	
	{#if $screenShareEnabled}
	<Button pill={true} on:click={toggleScreenShare} class="bg-green-500 text-white hover:bg-green-700">
		<ArrowUpFromBracketOutline class="h-6 w-6" />
	</Button>
	{:else}
	<Button pill={true} on:click={toggleScreenShare} class="bg-gray-500 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-700">
		<ArrowUpFromBracketOutline class="h-6 w-6" />
	</Button>
	{/if}
	<Button pill={true} on:click={endCall} class="bg-red-500 text-white dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-700">
		<PhoneHangupOutline class="h-6 w-6" />
	</Button>
</div>