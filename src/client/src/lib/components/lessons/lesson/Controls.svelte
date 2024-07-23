<script lang="ts">
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import {
			RocketSolid,
			MicrophoneSolid,
			VideoCameraSolid,
			PhoneHangupSolid,
			VideoCameraOutline,
			MicrophoneSlashSolid,
			WindowRestoreSolid
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

<div class="mb-4 flex w-1/4 items-center justify-center">

	<div class="flex space-x-4">
			<Button color={isMicOn ? 'primary' : 'red'} class="rounded-full p-2" on:click={toggleMicrophone}>
					<svelte:component this={isMicOn ? MicrophoneSolid : MicrophoneSlashSolid} class="w-6 h-6" />
			</Button>

			<Button color={isCameraOn ? 'primary' : 'red'} class="rounded-full p-2" on:click={toggleCamera}>
					<svelte:component this={isCameraOn ? VideoCameraSolid : VideoCameraSolid} class="w-6 h-6" />
			</Button>

			{#if role === 'lecturer'}
					<Button color={isScreenShareOn ? 'primary' : 'light'} class="rounded-full p-2" on:click={toggleScreenShare}>
							<WindowRestoreSolid class="w-6 h-6" />
					</Button>

					<Button color={isEnvironmentOn ? 'primary' : 'light'} class="rounded-full p-2" on:click={toggleEnvironment}>
							<RocketSolid class="w-6 h-6" />
					</Button>
			{/if}

			<Button color="red" class="rounded-full p-2" on:click={endCall}>
					<PhoneHangupSolid class="w-6 h-6" />
			</Button>
	</div>
</div>