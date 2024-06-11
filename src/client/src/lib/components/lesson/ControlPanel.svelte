<script lang="ts">
	import { type Call } from '@stream-io/video-client';

	export let call: Call;

	function toggleMicrophone() {
		call.microphone.toggle();
	}

	function toggleCamera() {
		call.camera.toggle();
	}
</script>

<div>
	<button on:click={toggleMicrophone}>
		<!-- {#if call.microphone.state.status === 'enabled'}
			Turn off mic
		{:else}
			Turn on mic
		{/if} -->
        Mic
	</button>

	<button on:click={toggleCamera}>
		<!-- {#if call.camera.state.status === 'enabled'}
			Turn off camera
		{:else}
			Turn on camera
		{/if} -->
        Camera
	</button>
</div>
