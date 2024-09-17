<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Button, Card, Toggle } from 'flowbite-svelte';
	import { goto } from '$app/navigation';

	export let onJoin;

	let audioLevel = 0;
	let isMicOn = true;
	let isCameraOn = true;
	let darkMode = false;

	let audioStream: MediaStream;
	let videoStream: MediaStream;
	let audioContext: AudioContext;
	let videoElement: HTMLVideoElement;

	// Function to generate random floating elements
	const floatingElements = Array(10)
		.fill()
		.map(() => ({
			size: Math.random() * 50 + 25,
			left: Math.random() * 100,
			top: Math.random() * 100,
			duration: Math.random() * 10 + 5,
			delay: Math.random() * 5
		}));

	// Function to update theme
	function updateTheme(isDark: boolean) {
		darkMode = isDark;
		if (darkMode) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

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

			// Initialize theme
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			updateTheme(mediaQuery.matches);

			// Listen for changes in color scheme preference
			mediaQuery.addEventListener('change', (e) => updateTheme(e.matches));

			// Cleanup listener on component destroy
			return () => mediaQuery.removeEventListener('change', updateTheme);
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

<main
	class="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-green-400 via-green-500 to-emerald-600 p-4 transition-colors duration-300 dark:from-green-800 dark:via-green-900 dark:to-emerald-950 sm:p-6 md:p-8"
>
	<!-- Animated background elements -->
	<div class="absolute inset-0 overflow-hidden">
		{#each floatingElements as element}
			<div
				class="animate-float absolute rounded-full bg-white bg-opacity-10 dark:bg-gray-300 dark:bg-opacity-10"
				style="width: {element.size}px; height: {element.size}px; left: {element.left}%; top: {element.top}%; animation-duration: {element.duration}s; animation-delay: {element.delay}s;"
			/>
		{/each}
	</div>

	<Card
		class="w-full max-w-md rounded-xl border border-white border-opacity-20 bg-white bg-opacity-10 shadow-2xl backdrop-blur-lg transition-colors duration-300 dark:border-gray-700 dark:border-opacity-50 dark:bg-gray-800 dark:bg-opacity-30 sm:max-w-lg md:max-w-xl lg:max-w-2xl"
	>
		<h5
			class="mb-4 text-center text-2xl font-bold tracking-tight text-white dark:text-gray-100 sm:text-3xl"
		>
			Check your audio and video
		</h5>

		<div class="space-y-6">
			<div class="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg">
				<video
					bind:this={videoElement}
					autoplay
					muted
					playsinline
					class="h-full w-full object-cover"
				/>
			</div>

			<div
				class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
			>
				<Toggle
					checked={isMicOn}
					on:change={toggleMicrophone}
					color="green"
					class="text-white dark:text-gray-300">Microphone</Toggle
				>

				<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200 sm:w-32">
					<div
						class="h-full bg-green-600 transition-all duration-300 ease-out"
						style="width: {audioLevel * 100}%"
					/>
				</div>
			</div>

			<Toggle
				checked={isCameraOn}
				on:change={toggleCamera}
				color="green"
				class="text-white dark:text-gray-300">Camera</Toggle
			>

			<div class="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
				<Button
					on:click={() => onJoin(isMicOn, isCameraOn)}
					class="w-full transform rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-green-700 hover:shadow-xl dark:bg-green-700 dark:hover:bg-green-800"
					>Join</Button
				>
				<Button
					on:click={() => goto('/')}
					class="w-full transform rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:bg-red-700 hover:shadow-xl dark:bg-red-700 dark:hover:bg-red-800"
					>Exit</Button
				>
			</div>
		</div>
	</Card>
</main>

<style>
	@keyframes float {
		0% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-20px);
		}
		100% {
			transform: translateY(0px);
		}
	}

	.animate-float {
		animation: float 3s ease-in-out infinite;
	}

	:global(body) {
		overflow: auto;
	}

	:global(.dark) {
		color-scheme: dark;
	}
</style>
