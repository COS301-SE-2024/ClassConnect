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

	export let role: string;

	const callStore = getContext<Writable<Call | null>>('call');

	let isEnvironmentOn = false;
	let isCameraOn = $callStore?.camera.state.status === 'enabled' ? true : false;
	let isMicOn = $callStore?.microphone.state.status === 'enabled' ? true : false;
	let isScreenShareOn = $callStore?.screenShare.state.status === 'enabled' ? true : false;

	let mediaRecorder: MediaRecorder | null = null;
	let recordedChunks: Blob[] = [];
	let isRecording: boolean = false;

	let lessonId: string;

	// Extract the lesson ID from the URL parameters
	$: lessonId = $page.params.lesson;

	function toggleMicrophone() {
		isMicOn = !isMicOn;
		$callStore?.microphone.toggle();
	}

	function toggleCamera() {
		isCameraOn = !isCameraOn;
		$callStore?.camera.toggle();
	}

	function toggleScreenShare() {
		isEnvironmentOn = false;
		$callStore?.update({ custom: { environment: isEnvironmentOn } });

		isScreenShareOn = !isScreenShareOn;
		$callStore?.screenShare.toggle();
	}

	function toggleEnvironment() {
		isScreenShareOn = false;
		$callStore?.screenShare.disable();

		isEnvironmentOn = !isEnvironmentOn;
		$callStore?.update({ custom: { environment: isEnvironmentOn } });
	}

	async function endCall() {
		await $callStore?.leave();
		goto(`/workspaces/${$page.params.workspace}/lessons`);
	}

	async function startRecording(): Promise<void> {
		const toastId = toast.loading('Starting recording...');
		try {
			const displayMediaOptions = {
				video: {
					displaySurface: 'browser',
					frameRate: 30
				},
				audio: false // We'll handle audio separately
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

			// Get audio stream with improved quality
			const audioStream: MediaStream = await navigator.mediaDevices.getUserMedia({
				audio: audioConstraints
			});

			// Combine the streams
			const combinedStream = new MediaStream([
				...screenStream.getVideoTracks(),
				...audioStream.getAudioTracks()
			]);

			// Try different MIME types
			const mimeTypes = [
				'video/webm;codecs=vp8,opus',
				'video/webm;codecs=vp9,opus',
				'video/webm;codecs=h264,opus',
				'video/webm',
				'video/mp4'
			];

			let selectedMimeType = '';
			for (const mimeType of mimeTypes) {
				if (MediaRecorder.isTypeSupported(mimeType)) {
					selectedMimeType = mimeType;
					break;
				}
			}

			if (!selectedMimeType) {
				throw new Error('No supported MIME type found for MediaRecorder');
			}

			// Set up MediaRecorder with higher bitrate
			const mediaRecorderOptions = {
				mimeType: selectedMimeType,
				videoBitsPerSecond: 3000000, // 3 Mbps
				audioBitsPerSecond: 128000 // 128 kbps
			};

			mediaRecorder = new MediaRecorder(combinedStream, mediaRecorderOptions);

			mediaRecorder.ondataavailable = (event: BlobEvent) => {
				if (event.data.size > 0) {
					recordedChunks.push(event.data);
				}
			};

			mediaRecorder.onstop = saveRecording;

			// Start recording with smaller time slices for more frequent ondataavailable events
			mediaRecorder.start(1000); // 1 second time slices
			isRecording = true;
			toast.dismiss(toastId);
			toast.success('Recording started successfully');
		} catch (error) {
			console.error('Error starting recording:', error);
			toast.dismiss(toastId);
			toast.error('Failed to start recording');
		}
	}

	function stopRecording(): void {
		if (mediaRecorder && isRecording) {
			mediaRecorder.stop();
			isRecording = false;
		}
	}

	async function saveRecording(): Promise<void> {
		const toastId = toast.loading('Saving recording...');
		const mimeType = mediaRecorder?.mimeType || 'video/webm';
		const blob: Blob = new Blob(recordedChunks, { type: mimeType });
		const fileName = `screen-recording.${mimeType.split('/')[1].split(';')[0]}`;
		const file = new File([blob], fileName, { type: mimeType });
		let response: Response;
		const formData = new FormData();

		if (blob.size <= 4 * 1024 * 1024) {
			formData.append('LessonID', lessonId);
			formData.append('video', file);

			response = await fetch('?/SaveRecording', {
				method: 'POST',
				body: formData
			});
		} else {
			const data = await multipartUploadFile(file);
			formData.append('LessonID', lessonId);
			formData.append('videolink', data.url);

			response = await fetch('?/SaveRecordingLink', {
				method: 'POST',
				body: formData
			});
		}

		if (response.ok) {
			toast.dismiss(toastId);
			toast.success('Recording saved successfully');
		} else {
			toast.dismiss(toastId);
			toast.error('Failed to save recording');
		}

		// Clear the recorded chunks
		recordedChunks = [];
	}

	onDestroy(() => {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') {
			mediaRecorder.stop();
		}
	});
</script>

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
			<svelte:component this={isCameraOn ? VideoCameraSolid : VideoCameraSolid} class="h-6 w-6" />
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
				<Button color="light" class="rounded-full p-2" on:click={startRecording}>
					<CameraPhotoOutline class="h-6 w-6" />
				</Button>
			{/if}
		{/if}
		<Button color="red" class="rounded-full p-2" on:click={endCall}>
			<PhoneHangupSolid class="h-6 w-6" />
		</Button>
	</div>
</div>
