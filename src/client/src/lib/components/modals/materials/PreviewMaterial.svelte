<script lang="ts">
	import { displayedSandboxObjectURL, ObjInScene } from '$src/lib/store/objects';
	import * as htmlToImage from 'html-to-image';
	import Scene from '$src/lib/components/sandbox/+Scene.svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { Button, Modal } from 'flowbite-svelte';
	import { Canvas } from '@threlte/core';

	export let open: boolean;
	export let file: File;
	export let url: string;
	export let type: string;
	export let title: string;
	export let description: string;
	let thumbnail: File;

	async function handleNo(event: Event) {
		event.preventDefault();
		displayedSandboxObjectURL.set('');
		ObjInScene.set(false);
		open = false;
	}

	async function handleYes(event: Event) {
		event.preventDefault();
		open = false;

		displayedSandboxObjectURL.set('');
		ObjInScene.set(false);

		console.log('Upload is being handled');
		await generateThumbnail();

		const formData = new FormData();

		formData.append('file', file);
		formData.append('title', title);
		formData.append('description', description);
		formData.append('thumbnail', thumbnail);

		toast.promise(
			fetch('?/uploadMat', {
				method: 'POST',
				body: formData
			}),
			{
				loading: 'Uploading material...',
				success: 'Material uploaded successfully!',
				error: 'Failed to upload material!'
			}
		);
	}
	// 3D Object Preview
	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let enableZoom: boolean = true;

	async function generateThumbnail() {
		console.log('Hello from thumbnail creaetion');
		const targetElement = document.getElementById('pdf-file');
		if (targetElement) {
			await htmlToImage.toBlob(targetElement).then(function (blob) {
				if (blob) {
					console.log(blob);
					thumbnail = new File([blob], 'thumbnail.png', { type: 'image/png' });
				} else {
					console.log('No blob found');
				}
			});
		} else {
			console.log('No target element found');
		}
	}
</script>

<Toaster />

{#if type === 'object'}
	<Modal id="previewModal" bind:open size="lg" placement="center">
		<div class="p-6 text-center">
			<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">
				Are you sure you want to upload this 3D object?
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
				<Button color="primary" on:click={handleYes}>Yes, upload it</Button>
				<Button color="alternative" on:click={handleNo}>No, cancel</Button>
			</div>
		</div>
	</Modal>
{/if}

{#if type === 'material'}
	<Modal id="previewModal" bind:open size="lg" placement="center">
		<div class="p-6 text-center">
			<h3 class="mb-5 text-lg font-normal text-black dark:text-gray-400">
				Are you sure you want to upload this 3D object?
			</h3>
			<div class="flex justify-center p-3">
				<section
					class="flex h-[500px] w-[500px] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
				>
					<div class="flex-1">
						<object
							id="pdf-file"
							class="h-full w-full flex-grow"
							data={url}
							title="Study Material"
						/>
					</div>
				</section>
			</div>
			<div class="flex justify-center gap-4">
				<Button color="primary" on:click={handleYes}>Yes, upload it</Button>
				<Button color="alternative" on:click={handleNo}>No, cancel</Button>
			</div>
		</div>
	</Modal>
{/if}
