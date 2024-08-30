<script lang="ts">
	import { displayedSandboxObjectURL, ObjInScene } from '$src/lib/store/objects';
	import Preview from '$lib/components/materials/Preview.svelte';
	import { mat_change } from '$lib/store/';
	import toast, { Toaster } from 'svelte-french-toast';
	import { Button, Modal } from 'flowbite-svelte';
	import { Canvas } from '@threlte/core';
	import { page } from '$app/stores';

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
			await multipartUploadFile();
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

	async function multipartUploadFile() {
		const toastId = toast.loading('Large File detected, uploading file...');
		const chunkSize = 5 * 1024 * 1024; // 5MB chunks
		const chunks = Math.ceil(file.size / chunkSize);
		const name = generateFileName(file.name);

		// Start the multipart upload
		const startResponse = await fetch('/api/upload', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				action: 'start',
				filename: name,
				contentType: file.type
			})
		});

		if (!startResponse.ok) {
			toast.dismiss(toastId);
			toast.error('Failed to start upload');
			return;
		}

		const { uploadId } = await startResponse.json();
		const parts = [];

		for (let i = 0; i < chunks; i++) {
			const start = i * chunkSize;
			const end = Math.min(start + chunkSize, file.size);
			const chunk = file.slice(start, end);

			// Get a signed URL for this part
			const urlResponse = await fetch('/api/upload', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'getSignedUrl',
					filename: name,
					partNumber: i + 1,
					uploadId
				})
			});

			if (!urlResponse.ok) {
				toast.dismiss(toastId);
				toast.error('Failed to get signed URL');
				return;
			}

			const { signedUrl } = await urlResponse.json();

			// Upload the part using the signed URL (directly to S3)
			const uploadResponse = await fetch(signedUrl, {
				method: 'PUT',
				body: chunk
			});

			if (!uploadResponse.ok) {
				toast.dismiss(toastId);
				toast.error(`Failed to upload part ${i + 1}`);
				return;
			}

			parts.push({
				PartNumber: i + 1,
				ETag: uploadResponse.headers.get('ETag')
			});
		}

		// Complete the multipart upload
		const completeResponse = await fetch('/api/upload', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				action: 'complete',
				filename: name,
				uploadId,
				parts
			})
		});

		if (!completeResponse.ok) {
			toast.dismiss(toastId);
			toast.error('Failed to complete upload');
			return;
		}

		const { fileUrl } = await completeResponse.json();

		toast.dismiss(toastId);

		// Handle the final file URL as needed
		const formData = new FormData();
		formData.append('link', fileUrl);
		formData.append('title', title);
		formData.append('description', description);
		formData.append('name', name);

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
		console.log('File uploaded successfully:', fileUrl);
	}

	
	function generateFileName(originalFileName: string): string {
		const lastDotIndex = originalFileName.lastIndexOf('.');
		if (lastDotIndex === -1) {
			throw new Error('Filename does not have an extension');
		}

		const extension = originalFileName.substring(lastDotIndex);
		const timestamp = Math.floor(Date.now() / 1000);
		const timestampHex = timestamp.toString(16).padStart(8, '0');
		const randomValue = crypto.getRandomValues(new Uint8Array(5));
		const randomValueHex = Array.from(randomValue)
			.map((b) => b.toString(16).padStart(2, '0'))
			.join('');
		const counter = Math.floor(Math.random() * 0xffffff);
		const counterHex = counter.toString(16).padStart(6, '0');
		const objectId = timestampHex + randomValueHex + counterHex;

		return `${objectId}${extension}`;
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
