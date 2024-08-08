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
		CameraPhotoOutline
	} from 'flowbite-svelte-icons';

	import type { Writable } from 'svelte/store';
	import { OwnCapability } from '@stream-io/video-client';
	import type { Call } from '@stream-io/video-client';
	import toast, { Toaster } from 'svelte-french-toast';

	export let role: string;

	const callStore = getContext<Writable<Call | null>>('call');

	let isEnvironmentOn = false;
	let isRecording = false;
	let isCameraOn = $callStore?.camera.state.status === 'enabled' ? true : false;
	let isMicOn = $callStore?.microphone.state.status === 'enabled' ? true : false;
	let isScreenShareOn = $callStore?.screenShare.state.status === 'enabled' ? true : false;

	let lessonId: string;

	// Extract the lesson ID from the URL parameters
	$: lessonId = $page.params.lesson;

	console.log('Lesson ID:', lessonId);

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
	async function toggleRecording() {
		if (!isRecording) {
			if ($callStore?.permissionsContext.hasPermission(OwnCapability.START_RECORD_CALL)) {
				const response = $callStore?.startRecording();
				await toast.promise(response, {
					loading: 'Starting recording...',
					success: 'Recording started successfully!',
					error: 'Failed to start recording!'
				});
				console.log('Recording response:', response);
				isRecording = true;
			} else {
				toast.error('Recording is not allowed for this call');
			}
		} else {
			if ($callStore) {
				if ($callStore?.permissionsContext.hasPermission(OwnCapability.STOP_RECORD_CALL)) {
					await toast.promise($callStore?.stopRecording(), {
						loading: 'Stopping recording...',
						success: 'Recording stopped successfully!',
						error: 'Failed to stop recording!'
					});
					try {
						const recordings = await $callStore?.queryRecordings();
						console.log('Recordings:', recordings);
						if (recordings && recordings.recordings.length > 0) {
							console.log('Recording:', recordings.recordings[recordings.recordings.length - 1]);
							const record = recordings.recordings[recordings.recordings.length - 1];

							const url = record.url;
							const formData = new FormData();

							formData.append('recordingURL', url);
							formData.append('LessonID', lessonId);

							const response = await fetch('?/SaveRecording', {
								method: 'POST',
								body: formData
							});

							if (response.ok) {
								console.log('Recording saved successfully');
								toast.success('Recording saved successfully');
							} else {
								console.error('Failed to save recording');
							}
						} else {
							console.log('No recordings found');
						}
					} catch (e) {
						console.error('Error querying recordings:', e);
					}
					isRecording = false;
				} else {
					toast.error('You are not allowed to stop recording');
				}
			} else {
				toast.error('No call to stop recording');
			}
		}
	}
	async function endCall() {
		await $callStore?.leave();
		goto(`/workspaces/${$page.params.workspace}/lessons`);
	}
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

			<Button
				color={isRecording ? 'primary' : 'light'}
				class="rounded-full p-2"
				on:click={toggleRecording}
			>
				<CameraPhotoOutline class="h-6 w-6" />
			</Button>
		{/if}

		<Button color="red" class="rounded-full p-2" on:click={endCall}>
			<PhoneHangupSolid class="h-6 w-6" />
		</Button>
	</div>
</div>
