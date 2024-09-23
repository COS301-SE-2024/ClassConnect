<script lang="ts">
	import { createEventDispatcher, getContext } from 'svelte';
	import { Button, Tooltip } from 'flowbite-svelte';
	import { Camera, EyeSlash, Tv, Cube, Camera as VideoRecord, PhoneXMark } from 'svelte-heros-v2';
	import { MicrophoneSlashSolid, MicrophoneSolid } from 'flowbite-svelte-icons';
	import { onDestroy } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { Call } from '@stream-io/video-client';
	import { multipartUploadFile } from '$lib/utils';
	import toast, { Toaster } from 'svelte-french-toast';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	export let role: string;
	const callStore = getContext<Writable<Call | null>>('call');
	let mediaRecorder: MediaRecorder | null = null;
	let recordedChunks: Blob[] = [];
	let lessonID: string;

	let isMicOn = $callStore?.microphone.state.status === 'enabled' ? true : false;
	let isCameraOn = $callStore?.camera.state.status === 'enabled' ? true : false;
	let isScreenSharing = $callStore?.screenShare.state.status === 'enabled' ? true : false;
	let isEnvironmentOn = false;
	let isRecording: boolean = false;

	$: lessonID = $page.params.lesson;

	function toggleMic() {
		isMicOn = !isMicOn;
		$callStore?.microphone.toggle();
	}

	function toggleCamera() {
		isCameraOn = !isCameraOn;
		$callStore?.camera.toggle();
	}

	function toggleScreenShare() {
		if (isEnvironmentOn = true) {
			isEnvironmentOn = false;
        	$callStore?.update({ custom: { environment: isEnvironmentOn } });
			isScreenSharing = !isScreenSharing;
			$callStore?.screenShare.toggle();
		} else {
			isScreenSharing = !isScreenSharing;
			$callStore?.screenShare.toggle();
		}
	}

	function toggleEnvironment() {
		if (isScreenSharing = true) {
			isScreenSharing = false;
			$callStore?.screenShare.disable();
			isEnvironmentOn = !isEnvironmentOn;
			$callStore?.update({ custom: { environment: isEnvironmentOn } });
		}
		
	}

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

            const combinedStream = new MediaStream([
                ...screenStream.getVideoTracks(),
                ...audioStream.getAudioTracks()
            ]);

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

            mediaRecorder.start(1000);
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
            formData.append('LessonID', lessonID);
            formData.append('video', file);

            response = await fetch('?/SaveRecording', {
                method: 'POST',
                body: formData
            });
        } else {
            const data = await multipartUploadFile(file);
            formData.append('LessonID', lessonID);
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
        recordedChunks = [];
    }

	async function endCall() {
		await $callStore?.leave();
        goto(`/workspaces/${$page.params.workspace}/lessons`);
	}

	onDestroy(() => {
        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            mediaRecorder.stop();
        }
    });
</script>

<Toaster />

<div class="bg-blue fixed bottom-0 left-0 right-0 p-4 shadow-lg">
	<div class="flex justify-center space-x-4">
		<Tooltip placement="top">
			<Button color={isMicOn ? 'primary' : 'red'} class="rounded-full p-3" on:click={toggleMic}>
				{#if isMicOn}
					<MicrophoneSolid class="h-6 w-6" />
				{:else}
					<MicrophoneSlashSolid class="h-6 w-6" />
				{/if}
			</Button>
			<span>{isMicOn ? 'Turn off microphone' : 'Turn on microphone'}</span>
		</Tooltip>

		<Tooltip placement="top">
			<Button
				color={isCameraOn ? 'primary' : 'red'}
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

		{#if role === 'lecturer'}

		<Tooltip placement="top">
			<Button
				color={isScreenSharing ? 'primary' : 'red'}
				class="rounded-full p-3"
				on:click={toggleScreenShare}
			>
				<Tv class="h-6 w-6" />
			</Button>
			<span>{isScreenSharing ? 'Stop screen sharing' : 'Share screen'}</span>
		</Tooltip>

		<Tooltip placement="top">
			<Button
				color={isEnvironmentOn ? 'primary' : 'red'}
				class="rounded-full p-3"
				on:click={toggleEnvironment}
			>
				<Cube class="h-6 w-6" />
			</Button>
			<span>{isEnvironmentOn ? 'Exit 3D model' : 'Interact with 3D model'}</span>
		</Tooltip>

		<Tooltip placement="top">
			<Button
				color={isRecording ? 'red' : 'light'}
				class="rounded-full p-3"
				on:click={isRecording ? stopRecording : startRecording}
			>
				<VideoRecord class="h-6 w-6" />
			</Button>
			<span>{isRecording ? 'Stop recording' : 'Start recording'}</span>
		</Tooltip>	

		{/if}

		<Tooltip placement="top">
			<Button color="red" class="rounded-full p-3" on:click={endCall}>
				<PhoneXMark class="h-6 w-6" />
			</Button>
			<span>End call</span>
		</Tooltip>
	</div>
</div>
