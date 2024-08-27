<script lang="ts">
	import { Canvas } from '@threlte/core';
	import Scene from '$src/lib/components/sandbox/+Scene.svelte';
	import { Button, Modal } from 'flowbite-svelte';
	import { displayedSandboxObjectURL, ObjInScene } from '$src/lib/store/objects';
	export let open: boolean;

	async function handleNo(event: Event) {
		event.preventDefault();
		displayedSandboxObjectURL.set('');
		ObjInScene.set(false);
		open = false;
	}
	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let enableZoom: boolean = true;
</script>

<Modal id="previewModal" bind:open size="lg" placement="center">
	<div class="p-6 text-center">
		<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">
			Are you sure you want to import this 3D object?
		</h3>
		<div class="flex justify-center p-3">
			<section
				class="flex h-[500px] w-[500px] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
			>
				<div class="flex-1">
					<Canvas>
						<Scene
							{enableDamping}
							{autoRotate}
							{rotateSpeed}
							{zoomToCursor}
							{zoomSpeed}
							{enableZoom}
						/>
					</Canvas>
				</div>
			</section>
		</div>
		<div class="flex justify-center gap-4">
			<Button color="primary" on:click={() => (open = false)}>Yes, upload it</Button>
			<Button color="alternative" on:click={handleNo}>No, cancel</Button>
		</div>
	</div>
</Modal>
