<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button, Tooltip } from 'flowbite-svelte';
	import {
		Camera,
		EyeSlash,
		Tv,
		Cube,
		Camera as VideoRecord,
		PhoneXMark
	} from 'svelte-heros-v2';
	import {
		MicrophoneSlashSolid,
		MicrophoneSolid
	} from 'flowbite-svelte-icons';

	const dispatch = createEventDispatcher();
	export let isMicOn = false;
	export let isCameraOn = false;
	export let isScreenSharing = false;
	export let is3DModelActive = false;
	export let isRecording = false;

	function toggleMic() {
		isMicOn = !isMicOn;
	}

	function toggleCamera() {
		isCameraOn = !isCameraOn;
	}

	function toggleScreenShare() {
		isScreenSharing = !isScreenSharing;
	}

	function toggle3DModel() {
		is3DModelActive = !is3DModelActive;
	}

	function toggleRecording() {
		isRecording = !isRecording;
	}

	function endCall() {
		// Implement end call logic
	}
</script>

<div class="bg-blue fixed bottom-0 left-0 right-0 p-4 shadow-lg">
	<div class="flex justify-center space-x-4">
		<!-- Microphone Toggle -->
		<Tooltip placement="top">
			<Button color={isMicOn ? 'dark' : 'light'} class="rounded-full p-3" on:click={toggleMic}>
				{#if isMicOn}
					<MicrophoneSolid class="h-6 w-6" />
				{:else}
					<MicrophoneSlashSolid class="h-6 w-6" />
				{/if}
			</Button>
			<span>{isMicOn ? 'Turn off microphone' : 'Turn on microphone'}</span>
		</Tooltip>

		<!-- Camera Toggle -->
		<Tooltip placement="top">
			<Button
				color={isCameraOn ? 'dark' : 'light'}
				class="rounded-full p-3"
				on:click={toggleCamera}
			>
				{#if isCameraOn}
					<Camera class="h-6 w-6" />
				{:else}
					<EyeSlash class="h-6 w-6" />
				{/if}
			</Button>
			<span>{isCameraOn ? 'Turn off camera' : 'Turn on camera'}</span>
		</Tooltip>

		<!-- Screen Share Toggle -->
		<Tooltip placement="top">
			<Button
				color={isScreenSharing ? 'dark' : 'light'}
				class="rounded-full p-3"
				on:click={toggleScreenShare}
			>
				<Tv class="h-6 w-6" />
			</Button>
			<span>{isScreenSharing ? 'Stop screen sharing' : 'Share screen'}</span>
		</Tooltip>

		<!-- 3D Model Toggle -->
		<Tooltip placement="top">
			<Button
				color={is3DModelActive ? 'dark' : 'light'}
				class="rounded-full p-3"
				on:click={toggle3DModel}
			>
				<Cube class="h-6 w-6" />
			</Button>
			<span>{is3DModelActive ? 'Exit 3D model' : 'Interact with 3D model'}</span>
		</Tooltip>

		<!-- Recording Toggle -->
		<Tooltip placement="top">
			<Button
				color={isRecording ? 'red' : 'light'}
				class="rounded-full p-3"
				on:click={toggleRecording}
			>
				<VideoRecord class="h-6 w-6" />
			</Button>
			<span>{isRecording ? 'Stop recording' : 'Start recording'}</span>
		</Tooltip>

		<!-- End Call -->
		<Tooltip placement="top">
			<Button color="red" class="rounded-full p-3" on:click={endCall}>
				<PhoneXMark class="h-6 w-6" />
			</Button>
			<span>End call</span>
		</Tooltip>
	</div>
</div>
