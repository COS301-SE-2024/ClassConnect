<script lang="ts">
	import { type Call } from '@stream-io/video-client';
	import { goto } from '$app/navigation';
	import { Button, DarkMode } from 'flowbite-svelte';
	import {
		MicrophoneOutline,
		MicrophoneSlashOutline,
		VideoCameraOutline,
		PhoneHangupOutline
	} from 'flowbite-svelte-icons';
	import { writable } from 'svelte/store';
	import { screenShareEnabled, cameraEnabled } from '$lib/store/index';

	import ScreenShareIcon from '$lib/images/ScreenShareIcon.svelte';
	import ScreenShareOffIcon from '$lib/images/ScreenShareOffIcon.svelte';

	export let call: Call;

	const microphoneEnabled = writable(false);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	let screenShare;
	screenShareEnabled.subscribe((value: boolean) => {
		screenShare = value;
	});

	function toggleMicrophone() {
		call.microphone.toggle();
		microphoneEnabled.update((enabled) => !enabled);
	}

	function toggleCamera() {
		call.camera.toggle();
		cameraEnabled.update((enabled) => !enabled);
	}

	function toggleScreenShare() {
		call.screenShare.toggle();
		screenShareEnabled.update((enabled) => !enabled);
	}

	function endCall() {
		call.leave();
		goto('/lessons');
	}
</script>

<div class="flex h-full items-center justify-around bg-gray-300 p-4 dark:bg-gray-800">
	<DarkMode />
	{#if $microphoneEnabled}
		<Button
			pill={true}
			on:click={toggleMicrophone}
			class="bg-green-500 text-white hover:bg-green-700"
		>
			<MicrophoneOutline class="h-6 w-6" />
		</Button>
	{:else}
		<Button
			pill={true}
			on:click={toggleMicrophone}
			class="bg-gray-500  text-white hover:bg-gray-700  dark:bg-gray-500  dark:hover:bg-gray-700"
		>
			<MicrophoneSlashOutline class="h-6 w-6" />
		</Button>
	{/if}

	{#if $cameraEnabled}
		<Button
			pill={true}
			on:click={toggleCamera}
			class="bg-green-500 text-white hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-700"
		>
			<VideoCameraOutline class="h-6 w-6" />
		</Button>
	{:else}
		<Button
			pill={true}
			on:click={toggleCamera}
			class="bg-gray-500  text-white hover:bg-gray-700  dark:bg-gray-500  dark:hover:bg-gray-700"
		>
			<VideoCameraOutline class="h-6 w-6" />
		</Button>
	{/if}

	{#if $screenShareEnabled}
		<Button
			pill={true}
			on:click={toggleScreenShare}
			class="bg-green-500 text-white hover:bg-green-700"
		>
			<ScreenShareIcon />
		</Button>
	{:else}
		<Button
			pill={true}
			on:click={toggleScreenShare}
			class="bg-gray-500 text-white hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-700"
		>
			<ScreenShareOffIcon />
		</Button>
	{/if}
	<Button
		pill={true}
		on:click={endCall}
		class="bg-red-500 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-700"
	>
		<PhoneHangupOutline class="h-6 w-6" />
	</Button>
</div>
