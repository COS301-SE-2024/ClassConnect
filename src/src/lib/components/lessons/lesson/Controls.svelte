<script lang="ts">
	// Import required stores and helpers
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import { goto } from '$app/navigation';
	import { Button } from 'flowbite-svelte';
	import {
		RocketSolid,
		MicrophoneSolid,
		VideoCameraSolid,
		PhoneHangupSolid,
		MicrophoneSlashSolid,
		WindowRestoreSolid,
		CameraPhotoOutline,
		VisaSolid
	} from 'flowbite-svelte-icons';
	import { onDestroy } from 'svelte';

	import type { Writable } from 'svelte/store';
	import type { Call } from '@stream-io/video-client';
	import { multipartUploadFile } from '$lib/utils';
	import toast, { Toaster } from 'svelte-french-toast';

	// Role is passed from a parent component (lecturer, student, etc.)
	export let role: string;

	// Access the call state globally via Svelte's context API
	const callStore = getContext<Writable<Call | null>>('call');

	// Track different states for media elements (camera, mic, screen share)
	let isEnvironmentOn = false;
	let isCameraOn = $callStore?.camera.state.status === 'enabled' ? true : false;
	let isMicOn = $callStore?.microphone.state.status === 'enabled' ? true : false;
	let isScreenShareOn = $callStore?.screenShare.state.status === 'enabled' ? true : false;

	// Recording management
	let mediaRecorder: MediaRecorder | null = null;
	let recordedChunks: Blob[] = [];
	let isRecording: boolean = false;

	// Extract lessonId from URL params using the Svelte `page` store
	let lessonId: string;
	$: lessonId = $page.params.lesson;

	// Toggle microphone on/off
	function toggleMicrophone() {
		isMicOn = !isMicOn;
		$callStore?.microphone.toggle();
	}

	// Toggle camera on/off
	function toggleCamera() {
		isCameraOn = !isCameraOn;
		$callStore?.camera.toggle();
	}

	// Toggle screen sharing on/off
	function toggleScreenShare() {
		isEnvironmentOn = false; // Disable environment when screen sharing
		$callStore?.update({ custom: { environment: isEnvironmentOn } });

		isScreenShareOn = !isScreenShareOn;
		$callStore?.screenShare.toggle();
	}

	// Toggle environment on/off (3D models)
	function toggleEnvironment() {
		isScreenShareOn = false; // Disable screen sharing when environment is enabled
		$callStore?.screenShare.disable();

		isEnvironmentOn = !isEnvironmentOn;
		$callStore?.update({ custom: { environment: isEnvironmentOn } });
	}

	// End call and navigate to another page
	async function endCall() {
		await $callStore?.leave();
		goto(`/workspaces/${$page.params.workspace}/lessons`);
	}

	// Start screen recording
	async function startRecording(): Promise<void> {
		const toastId = toast.loading('Starting recording...');
		try {
			const displayMediaOptions = {
				video: {
					displaySurface: 'browser',
					frameRate: 30
				},
				audio: false
			};

			const audioConstraints = {
				echoCancellation: true,
				noiseSuppression: true,
				autoGainControl: true,
				sampleRate: 48000,
				channelCount: 2
			};

			const screenStream: MediaStream = await navigator.mediaDevices.getDisplayMedia(
				displayMediaOptions as any
			);
			const audioStream: MediaStream = await navigator.mediaDevices.getUserMedia({
				audio: audioConstraints
			});

			// Combine video and audio streams
			const combinedStream = new MediaStream([
				...screenStream.getVideoTracks(),
				...audioStream.getAudioTracks()
			]);

			// Set appropriate MIME type
			const mimeTypes = [
				'video/webm;codecs=vp8,opus',
				'video/webm;codecs=vp9,opus',
				'video/webm;codecs=h264,opus',
				'video/webm',
				'video/mp4'
			];

			let selectedMimeType =
				mimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) || 'video/webm';
			const mediaRecorderOptions = {
				mimeType: selectedMimeType,
				videoBitsPerSecond: 3000000, // 3 Mbps
				audioBitsPerSecond: 128000 // 128 kbps
			};

			// Start media recorder
			mediaRecorder = new MediaRecorder(combinedStream, mediaRecorderOptions);
			mediaRecorder.ondataavailable = (event: BlobEvent) => {
				if (event.data.size > 0) {
					recordedChunks.push(event.data);
				}
			};

			mediaRecorder.onstop = saveRecording;
			mediaRecorder.start(1000); // Record in 1s intervals

			isRecording = true;
			toast.dismiss(toastId);
			toast.success('Recording started successfully');
		} catch (error) {
			console.error('Error starting recording:', error);
			toast.dismiss(toastId);
			toast.error('Failed to start recording');
		}
	}

	// Stop screen recording
	function stopRecording(): void {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			isRecording = false;
		}
	}

	// Save recorded file
	async function saveRecording(): Promise<void> {
		const toastId = toast.loading('Saving recording...');
		const mimeType = mediaRecorder?.mimeType || 'video/webm';
		const blob: Blob = new Blob(recordedChunks, { type: mimeType });
		const file = new File([blob], `screen-recording.${mimeType.split('/')[1]}`, { type: mimeType });

		let response: Response;
		const formData = new FormData();
		formData.append('LessonID', lessonId);

		if (blob.size <= 4 * 1024 * 1024) {
			formData.append('video', file);
			response = await fetch('?/SaveRecording', { method: 'POST', body: formData });
		} else {
			const data = await multipartUploadFile(file);
			formData.append('videolink', data.url);
			response = await fetch('?/SaveRecordingLink', { method: 'POST', body: formData });
		}

		if (response.ok) {
			toast.dismiss(toastId);
			toast.success('Recording saved successfully');
		} else {
			toast.dismiss(toastId);
			toast.error('Failed to save recording');
		}
		recordedChunks = []; // Clear recording buffer
	}

	// Clean up on component destroy
	onDestroy(() => {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
		}
	});
</script>

<!-- UI Components -->
<Toaster />

<div class="mb-4 flex w-1/4 items-center justify-center">
	<div class="flex space-x-4">
		<Button
			color={isMicOn ? 'primary' : 'red'}
			class="rounded-full p-2"
			on:click={toggleMicrophone}
		>
			<svelte:component this={isMicOn ? MicrophoneSolid : MicrophoneSlashSolid} class="h-6 w-6" />
		</Button>

		<Button color={isCameraOn ? 'primary' : 'red'} class="rounded-full p-2" on:click={toggleCamera}>
			<VideoCameraSolid class="h-6 w-6" />
		</Button>

		{#if role === 'lecturer'}
			<Button
				color={isScreenShareOn ? 'primary' : 'light'}
				class="rounded-full p-2"
				on:click={toggleScreenShare}
			>
				<WindowRestoreSolid class="h-6 w-6" />
			</Button>

			<Button
				color={isEnvironmentOn ? 'primary' : 'light'}
				class="rounded-full p-2"
				on:click={toggleEnvironment}
			>
				<RocketSolid class="h-6 w-6" />
			</Button>

			{#if isRecording}
				<Button color="red" class="rounded-full p-2" on:click={stopRecording}>
					<VisaSolid class="h-6 w-6" />
				</Button>
			{:else}
				<Button color="primary" class="rounded-full p-2" on:click={startRecording}>
					<CameraPhotoOutline class="h-6 w-6" />
				</Button>
			{/if}
		{/if}

		<Button color="red" class="rounded-full p-2" on:click={endCall}>
			<PhoneHangupSolid class="h-6 w-6" />
		</Button>
	</div>
</div>
