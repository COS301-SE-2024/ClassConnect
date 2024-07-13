<script lang="ts">
	import { getContext } from 'svelte';
	import { Button } from 'flowbite-svelte';
	import {
		MicrophoneSolid,
		VideoCameraSolid,
		PhoneHangupSolid,
		VideoCameraOutline,
		MicrophoneSlashOutline,
		ArrowUpRightFromSquareOutline
	} from 'flowbite-svelte-icons';
	import type { Writable } from 'svelte/store';
	import type { Call } from '@stream-io/video-client';

	const callStore = getContext<Writable<Call | null>>('call');
	let isMicOn = $callStore?.microphone.state.status === 'enabled' ? true : false;
	let isCameraOn = $callStore?.camera.state.status === 'enabled' ? true : false;
	let isScreenShareOn = $callStore?.screenShare.state.status === 'enabled' ? true : false;

	function toggleMicrophone() {
		isMicOn = !isMicOn;
		$callStore?.microphone.toggle();
	}

	function toggleCamera() {
		isCameraOn = !isCameraOn;
		$callStore?.camera.toggle();
	}

	function toggleScreenShare() {
		isScreenShareOn = !isScreenShareOn;
		$callStore?.screenShare.toggle();
	}

	function endCall() {
		$callStore?.leave();
	}
</script>

<div class="mb-12 flex w-1/4 items-center justify-center rounded-full bg-gray-400 p-2 shadow-md">
	<Button pill={true} color={isMicOn ? 'green' : 'red'} class="mr-4" on:click={toggleMicrophone}>
		{#if isMicOn}
			<MicrophoneSolid />
		{:else}
			<MicrophoneSlashOutline />
		{/if}
	</Button>

	<Button pill={true} color={isCameraOn ? 'green' : 'red'} class="mr-4" on:click={toggleCamera}>
		{#if isCameraOn}
			<VideoCameraSolid />
		{:else}
			<VideoCameraOutline />
		{/if}
	</Button>

	<Button
		pill={true}
		color={isScreenShareOn ? 'green' : 'light'}
		class="mr-4"
		on:click={toggleScreenShare}
		disabled
	>
		<ArrowUpRightFromSquareOutline />
	</Button>

	<Button pill={true} color="red" on:click={endCall}>
		<PhoneHangupSolid />
	</Button>
</div>
