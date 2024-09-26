<script lang="ts">
	import { TabItem, Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { objURL, displayedSandboxObjectURL } from '$src/lib/store/objects';
	import UploadMaterial from '$lib/components/modals/materials/UploadMaterial.svelte';
	import {
		ArrowUpFromBracketOutline,
		ArrowRightOutline,
		DotsVerticalOutline,
		ShareNodesOutline,
		TrashBinOutline,
		ArrowDownToBracketOutline
	} from 'flowbite-svelte-icons';
	import DeleteMaterial from '$src/lib/components/modals/materials/DeleteMaterial.svelte';
	import Preview from '$src/lib/components/modals/materials/Preview.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import * as THREE from 'three';
	import { type GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

	let openPreviewModal = false;
	let openDeleteModal = false;

	export let tabName: any;
	export let tabBoolean: boolean;
	export let renderedMaterials: any[] = [];
	export const role: string = '';

	let id: string;
	let title: string;
	let url: string;
	let type: boolean;

	let materialSearchTerm = '';
	let filteredItems = renderedMaterials;

	$: filteredItems = renderedMaterials.filter(
		(material: any) =>
			material.title.toLowerCase().includes(materialSearchTerm.toLowerCase()) ||
			material.description.toLowerCase().includes(materialSearchTerm.toLowerCase())
	);

	let uploadModal = false;

	const handleFileOpening = (url: string, type: boolean) => {
		if (!type) {
			objURL.set(url);
			goto($page.url + '/material');
		} else {
			displayedSandboxObjectURL.set(url);
			let curr_url: string = $page.url.toString();
			curr_url = curr_url.replace('materials', 'environments/sandbox');
			goto(curr_url);
		}
	};

	const handleDelete = (mat_id: string, mat_title: string) => {
		id = mat_id;
		title = mat_title;
		openDeleteModal = true;
	};

	async function handleDownload(mat_url: string, mat_title: string) {
		const toastId = toast.loading('Downloading...');
		try {
			const response = await fetch(mat_url);
			const blob = await response.blob();

			const url = URL.createObjectURL(blob);
			const link = document.createElement('a');
			link.href = url;
			link.download = mat_title;
			document.body.appendChild(link);
			link.click();

			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.dismiss(toastId);
			toast.success('Downloaded successfully!');
		} catch (error) {
			console.error('Failed to download file:', error);
		}
	}

	const copyToClipboard = (url: string) => {
		try {
			navigator.clipboard.writeText(url);
			toast.success('URL copied to clipboard!');
		} catch (err) {
			toast.error('Failed to copy URL to clipboard!');
		}
	};

	let hoveredMaterial: any = null;

	function handleMouseEnter(material: any) {
		hoveredMaterial = material;
	}

	function handleMouseLeave() {
		hoveredMaterial = null;
	}

	function getDevicePerformanceScore(): number {
		const canvas = document.createElement('canvas');
		const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

		if (!gl) {
			console.warn('WebGL not supported. Defaulting to low performance score.');
			return 0.5;
		}

		// Type guard to ensure we're working with a WebGLRenderingContext
		if (!(gl instanceof WebGLRenderingContext)) {
			console.warn('Unexpected rendering context. Defaulting to medium performance score.');
			return 0.7;
		}

		let renderer = '';
		try {
			const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
			if (debugInfo) {
				renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
			}
		} catch (e) {
			console.warn('Unable to get GPU info. Defaulting to medium performance score.');
			return 0.7;
		}

		// Simple scoring based on GPU name (you might want to expand this)
		if (renderer.includes('NVIDIA') || renderer.includes('AMD')) return 1;
		if (renderer.includes('Intel')) return 0.7;
		return 0.5;
	}

	function create3DPreview(element: HTMLElement, material: any) {
		if (!material || !material.type) return;

		const performanceScore = getDevicePerformanceScore();
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
		const renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: performanceScore > 0.7,
			powerPreference: performanceScore > 0.8 ? 'high-performance' : 'default'
		});

		const pixelRatio = Math.min(window.devicePixelRatio, performanceScore * 2);
		renderer.setPixelRatio(pixelRatio);

		renderer.setSize(element.clientWidth, element.clientHeight);
		element.appendChild(renderer.domElement);

		const ambientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
		directionalLight.position.set(5, 5, 5);
		scene.add(directionalLight);

		const loader = new GLTFLoader();
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath('/draco/'); // Make sure to include Draco decoder files in your project
		loader.setDRACOLoader(dracoLoader);

		loader.load(
			material.file_path,
			(gltf: GLTF) => {
				scene.add(gltf.scene);

				// Center the model
				const box = new THREE.Box3().setFromObject(gltf.scene);
				const center = box.getCenter(new THREE.Vector3());
				gltf.scene.position.sub(center); // center the model

				const size = box.getSize(new THREE.Vector3());
				const maxDim = Math.max(size.x, size.y, size.z);
				const fov = camera.fov * (Math.PI / 180);
				let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

				camera.position.z = cameraZ * 2;

				const animate = () => {
					requestAnimationFrame(animate);
					gltf.scene.rotation.y += 0.01;
					renderer.render(scene, camera);
				};
				animate();
			},
			(xhr) => {
				console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
			},
			(error: ErrorEvent | unknown) => {
				console.error('An error happened while loading the 3D model:', error);
			}
		);

		return {
			destroy() {
				element.removeChild(renderer.domElement);
			}
		};
	}
</script>

<Toaster />

<TabItem open={tabBoolean}>
	<span slot="title">{tabName}</span>
	<div
		class="flex flex-col space-y-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:px-6 lg:px-8"
	>
		<div class="w-full max-w-lg">
			<div class="relative">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg
						class="h-5 w-5 text-gray-400 dark:text-gray-300"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="6.5" />
						<path d="m21 21-4.3-4.3" />
					</svg>
				</div>
				<input
					bind:value={materialSearchTerm}
					class="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2 pl-10 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-green-500 dark:focus:ring-green-600"
					type="text"
					placeholder="Search materials..."
				/>
			</div>
		</div>
		<Button
			on:click={() => (uploadModal = true)}
			class="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
		>
			<ArrowUpFromBracketOutline class="h-5 w-5" />
			<span>Upload File</span>
		</Button>
	</div>

	{#if filteredItems && filteredItems.length > 0}
		<div
			class="grid grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:px-8 xl:grid-cols-4"
		>
			{#each filteredItems as material (material.id)}
				<div
					class="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-700"
					on:mouseenter={() => handleMouseEnter(material)}
					on:mouseleave={handleMouseLeave}
					role="button"
					tabindex="0"
					on:keydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							handleMouseEnter(material);
						}
					}}
				>
					<div class="relative aspect-[5/6.455] overflow-hidden bg-gray-100 dark:bg-gray-700">
						{#if hoveredMaterial === material && material.type}
							<div use:create3DPreview={material} class="h-full w-full" />
						{:else}
							<img
								class="absolute inset-0 h-full w-full object-contain"
								src={material.previewImagePath || material.thumbnail}
								alt={material.title}
							/>
						{/if}
					</div>
					<div class="flex flex-1 flex-col p-4">
						<div class="mb-2 flex items-center justify-between">
							<h3 class="line-clamp-1 text-base font-bold text-gray-900 dark:text-white">
								{material.title}
							</h3>
							<div>
								<DotsVerticalOutline
									id="card-dot-menu-{material.id}"
									size="sm"
									class="cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
								/>
								<Dropdown placement="bottom" triggeredBy={`#card-dot-menu-${material.id}`}>
									<DropdownItem
										class="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
										on:click={() => copyToClipboard(material.file_path)}
									>
										<ShareNodesOutline class="h-4 w-4" />
										<span>Share</span>
									</DropdownItem>

									<DropdownItem
										class="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
										on:click={() => handleDownload(material.file_path, material.title)}
									>
										<ArrowDownToBracketOutline class="h-4 w-4" />
										<span>Download</span>
									</DropdownItem>
									<DropdownDivider />
									<DropdownItem
										class="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
										on:click={() => handleDelete(material.id, material.title)}
									>
										<TrashBinOutline class="h-4 w-4" />
										<span>Delete</span>
									</DropdownItem>
								</Dropdown>
							</div>
						</div>
						<p class="mb-4 line-clamp-2 flex-1 text-sm text-gray-600 dark:text-gray-300">
							{material.description}
						</p>
						<Button
							on:click={() => handleFileOpening(material.file_path, material.type)}
							class="w-full justify-center bg-green-600 text-sm hover:bg-green-700"
						>
							Open File
							<ArrowRightOutline class="ml-2 h-4 w-4" />
						</Button>
					</div>
				</div>
			{/each}
		</div>
	{:else}
		<p class="mt-8 text-center text-lg text-gray-600 dark:text-gray-300">No materials available</p>
	{/if}
</TabItem>

<UploadMaterial open={uploadModal} on:close={() => (uploadModal = false)} />

<Preview
	bind:open={openPreviewModal}
	{url}
	name={title}
	type={type ? 'object' : 'material'}
	on:close={() => (openPreviewModal = false)}
/>

<DeleteMaterial
	{id}
	bind:open={openDeleteModal}
	name={title}
	on:close={() => (openDeleteModal = false)}
/>
