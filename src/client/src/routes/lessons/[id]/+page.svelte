<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { StreamVideoClient, type User, type Call } from '@stream-io/video-client';

	import { userInfo } from '$lib/stores/store';
	import Container from '$lib/components/lesson/Container.svelte';
	import ControlPanel from '$lib/components/lesson/ControlPanel.svelte';

	export let data;
	const { apiKey, token } = data;

	let call: Call;
	let client: StreamVideoClient;

	onMount(async () => {
		client = new StreamVideoClient({ apiKey, token, user:{id: $userInfo.username, name: $userInfo.name} });
		call = client.call('default', 'call-id');

		await call.join({ create: true });
		await call.camera.enable();
		await call.microphone.enable();
	});

	onDestroy(() => {
		if (call) {
			call.leave();
		}

		if (client) {
			client.disconnectUser();
		}
	});

	function toggleMicrophone() {
		call.microphone.toggle();
	}

	function toggleCamera() {
		call.camera.toggle();
	}
</script>

<main>
	<Container {call} />
	<ControlPanel {call} />
</main>
