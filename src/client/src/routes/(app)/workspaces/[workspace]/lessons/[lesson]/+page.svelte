<script lang="ts">
	import { page } from '$app/stores';
	import { onMount, onDestroy } from 'svelte';
	import { StreamVideoClient, type Call } from '@stream-io/video-client';

	import { userInfo } from '$lib/store/index';
	import Container from '$lib/components/common/lesson/Container.svelte';
	import ControlPanel from '$lib/components/common/lesson/ControlPanel.svelte';

	export let data;
	const { apiKey, token } = data;

	let call: Call;
	let client: StreamVideoClient;

	onMount(async () => {
		client = new StreamVideoClient({
			apiKey,
			token,
			user: { id: $userInfo.username, name: $userInfo.name }
		});

		call = client.call('default', $page.params.id);

		await call.camera.disable();
		await call.microphone.disable();
		await call.join({ create: true });
	});

	onDestroy((): void => {
		if (call) call.leave();
		if (client) client.disconnectUser();
	});
</script>

<main class="flex h-screen flex-col">
	{#if call}
		<div class="flex-1 overflow-hidden">
			<Container {call} />
		</div>
		<div class="h-20">
			<ControlPanel {call} />
		</div>
	{/if}
</main>
