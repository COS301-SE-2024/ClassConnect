<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Button, Card, Toggle } from 'flowbite-svelte';

	export let onJoin;

	let audioLevel = 0;
	let isMicOn = true;
	let isCameraOn = true;

	let audioStream: MediaStream;
	let videoStream: MediaStream;
	let audioContext: AudioContext;
	let videoElement: HTMLVideoElement;

	onMount(async () => {
		try {
			audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
			videoStream = await navigator.mediaDevices.getUserMedia({ video: true });

			if (videoElement) videoElement.srcObject = videoStream;

			audioContext = new AudioContext();
			const source = audioContext.createMediaStreamSource(audioStream);
			const analyser = audioContext.createAnalyser();
			source.connect(analyser);

			const dataArray = new Uint8Array(analyser.frequencyBinCount);

			updateAudioLevel(analyser, dataArray);
		} catch (error) {
			console.error('Error accessing media devices:', error);
		}
	});

	onDestroy(() => {
		if (audioContext) audioContext.close();
		if (audioStream) audioStream.getTracks().forEach((track) => track.stop());
		if (videoStream) videoStream.getTracks().forEach((track) => track.stop());
	});

	function updateAudioLevel(analyser: AnalyserNode, dataArray: Uint8Array) {
		analyser.getByteFrequencyData(dataArray);
		audioLevel = Math.max(...dataArray) / 255;
		requestAnimationFrame(() => updateAudioLevel(analyser, dataArray));
	}

	function toggleMicrophone() {
		isMicOn = !isMicOn;
		audioStream.getAudioTracks().forEach((track) => (track.enabled = isMicOn));
	}

	function toggleCamera() {
		isCameraOn = !isCameraOn;
		videoStream.getVideoTracks().forEach((track) => (track.enabled = isCameraOn));
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-100">
	<Card class="w-full max-w-2xl">
		<h5 class="mb-4 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
			Check your audio and video
		</h5>

		<div class="space-y-6">
			<div class="aspect-w-16 aspect-h-9">
				<video
					bind:this={videoElement}
					autoplay
					muted
					playsinline
					class="h-full w-full rounded-lg object-cover"
				/>
			</div>

			<div class="flex items-center justify-between">
				<Toggle checked={isMicOn} on:change={toggleMicrophone}>Microphone</Toggle>

				<div class="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
					<div
						class="h-full bg-green-500 transition-all duration-300 ease-out"
						style="width: {audioLevel * 100}%"
					/>
				</div>
			</div>

			<Toggle checked={isCameraOn} on:change={toggleCamera}>Camera</Toggle>

			<Button on:click={() => onJoin(isMicOn, isCameraOn)}>Join Call</Button>
		</div>
	</Card>
</div>
