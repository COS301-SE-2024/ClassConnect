<script lang="ts">
	import { type Call } from '@stream-io/video-client';
	import { goto } from '$app/navigation';

	export let call: Call;

	function toggleMicrophone() {
		call.microphone.toggle();
	}

	function toggleCamera() {
		call.camera.toggle();
	}

	function toggleScreenShare() {
		call.screenShare.toggle();
	}

	function endCall() {
		call.leave();
		goto('/lessons');
	}
</script>

<div>
	<button
		on:click={toggleMicrophone}
		class="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
	>
		Mic
	</button>

	<button
		on:click={toggleCamera}
		class="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
	>
		Camera
	</button>

	<button
		on:click={toggleScreenShare}
		class="rounded bg-blue-500 px-2 py-1 font-bold text-white hover:bg-blue-700"
	>
		Share Screen
	</button>

	<button
		on:click={endCall}
		class="rounded bg-red-500 px-2 py-1 font-bold text-white hover:bg-red-700"
	>
		End Call
	</button>
</div>
