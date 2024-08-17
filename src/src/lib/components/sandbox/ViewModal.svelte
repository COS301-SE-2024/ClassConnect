<script lang="ts">
	import { getContext } from 'svelte';
	import { Button, Modal, Helper } from 'flowbite-svelte';

	export let open = false;

	const loadModel = getContext('loadModel') as (modelUrl: string) => void;

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const url = URL.createObjectURL(file);
			loadModel(url);
		}

		open = false;
	}
</script>

<Modal bind:open size="xs" autoclose={false} class="w-full">
	<h3 class="mb-5 text-gray-500 dark:text-white">View Your Own 3D Model</h3>

	<Button color="dark" class="w-full">
		<label for="upload-model" class="cursor-pointer"> Choose File </label>
	</Button>

	<input
		id="upload-model"
		type="file"
		accept=".gltf,.glb"
		class="hidden"
		on:change={handleFileUpload}
	/>

	<Helper>GLB or GLTF (MAX. 100 MB).</Helper>
</Modal>
