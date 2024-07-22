<script lang="ts">
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import {
		FlowbiteSolid,
		MicrophoneSolid,
		VideoCameraSolid,
		PhoneHangupSolid,
		VideoCameraOutline,
		MicrophoneSlashOutline,
		ArrowUpRightFromSquareOutline
	} from 'flowbite-svelte-icons';

	import type { Writable } from 'svelte/store';
	import type { Call } from '@stream-io/video-client';

	export let role: string;

	const callStore = getContext<Writable<Call | null>>('call');

	let isEnvironmentOn = false;
	let isCameraOn = $callStore?.camera.state.status === 'enabled' ? true : false;
	let isMicOn = $callStore?.microphone.state.status === 'enabled' ? true : false;
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

	function toggleEnvironment() {
		isEnvironmentOn = !isEnvironmentOn;
		$callStore?.update({ custom: { environment: isEnvironmentOn } });
	}

	function endCall() {
		$callStore?.leave();
		goto(`/workspaces/${$page.params.workspace}/lessons`);
	}
</script>

<div class="mb-12 flex w-1/4 items-center justify-center rounded-full bg-gray-400 shadow-md">
	<Button pill={true} color={isMicOn ? 'green' : 'red'} class="m-2" on:click={toggleMicrophone}>
		{#if isMicOn}
			<MicrophoneSolid />
		{:else}
			<MicrophoneSlashOutline />
		{/if}
	</Button>

	<Button pill={true} color={isCameraOn ? 'green' : 'red'} class="m-2" on:click={toggleCamera}>
		{#if isCameraOn}
			<VideoCameraSolid />
		{:else}
			<VideoCameraOutline />
		{/if}
	</Button>

	{#if role === 'lecturer'}
		<Button
			pill={true}
			class="m-2"
			on:click={toggleScreenShare}
			color={isScreenShareOn ? 'green' : 'light'}
		>
			<ArrowUpRightFromSquareOutline />
		</Button>

		<Button
			pill={true}
			class="m-2"
			on:click={toggleEnvironment}
			color={isEnvironmentOn ? 'green' : 'light'}
		>
			<FlowbiteSolid />
		</Button>
	{/if}

	<Button pill={true} color="red" on:click={endCall}>
		<PhoneHangupSolid />
	</Button>
</div>
