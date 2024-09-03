<script lang="ts">
	import { displayedSandboxObjectURL, ObjInScene } from '$src/lib/store/objects';
	import Preview from '$lib/components/materials/Preview.svelte';
	import { mat_change } from '$lib/store/';
	import toast, { Toaster } from 'svelte-french-toast';
	import { Button, Modal } from 'flowbite-svelte';
	import { Canvas } from '@threlte/core';
	import { page } from '$app/stores';
	import { multipartUploadFile } from '$lib/utils';

	export let open: boolean;
	export let file: File;
	export let url: string;
	export let type: string;
	export let title: string;
	export let description: string;

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

		if (file.size > 4 * 1024 * 1024) {
			await UploadFile();
		} else {
			const formData = new FormData();

			formData.append('file', file);
			formData.append('title', title);
			formData.append('description', description);

			await toast.promise(
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
			const log: string = 'change at timestamp: ' + new Date().toISOString();
			mat_change.set(log);
			document.getElementById('reload_btn_delete')?.click();
		}
	}

	async function UploadFile() {
		const toastId = toast.loading('Large File detected, uploading file...');
		try {
			const data = await multipartUploadFile(file);
			toast.dismiss(toastId);

			const formData = new FormData();
			formData.append('link', data.url);
			formData.append('title', title);
			formData.append('description', description);
			formData.append('name', data.name);

			await toast.promise(
				fetch('?/multiPartUploadFinal', {
					method: 'POST',
					body: formData
				}),
				{
					loading: 'Completing upload, please be patient...',
					success: 'Material uploaded successfully!',
					error: 'Failed to upload material!'
				}
			);

			const log = 'change at timestamp: ' + new Date().toISOString();
			mat_change.set(log);
			document.getElementById('reload_btn_delete')?.click();
		} catch (e) {
			toast.dismiss(toastId);
			toast.error('Failed to upload file: ' + e);
		}
	}
</script>

<Toaster />

<a id="reload_btn_delete" href={$page.url.pathname} data-sveltekit-reload class="hidden">
	<button>Reload</button>
</a>

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
							<Preview mat_url={url} />
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
				Are you sure you want to upload this file ?
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
