<script lang="ts">
  import { TabItem, Button, Dropdown, DropdownItem, DropdownDivider } from 'flowbite-svelte';
  import toast, { Toaster } from 'svelte-french-toast';
  import { objURL, displayedSandboxObjectURL } from '$src/lib/store/objects';
  import UploadMaterial from '$lib/components/modals/materials/UploadMaterial.svelte';
  import {
    ArrowUpFromBracketOutline,
    ArrowRightOutline,
    DotsVerticalOutline,
    EyeOutline,
    ShareNodesOutline,
    TrashBinOutline,
    ArrowDownToBracketOutline
  } from 'flowbite-svelte-icons';
  import DeleteMaterial from '$src/lib/components/modals/materials/DeleteMaterial.svelte';
  import Preview from '$src/lib/components/modals/materials/Preview.svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import * as THREE from 'three';
  import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

	let openPreviewModal = false;
	let openDeleteModal = false;

	export let tabName: any;
	export let tabBoolean: boolean;
	export let renderedMaterials: any[] = [];

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

	const handlePreview = (mat_url: string, mat_title: string, mat_type: boolean) => {
		url = mat_url;
		displayedSandboxObjectURL.set(url);
		title = mat_title;
		type = mat_type;
		openPreviewModal = true;
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

  function is3DObject(fileType: string): boolean {
    return ['gltf', 'glb'].includes(fileType.toLowerCase());
  }

  function getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  function initThreeJsPreview(canvas: HTMLCanvasElement, filePath: string) {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 0);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    loader.load(filePath, (gltf: GLTF) => {
      scene.add(gltf.scene);

      // Center and scale the model
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 1 / maxDim;
      gltf.scene.scale.setScalar(scale);

      gltf.scene.position.sub(center.multiplyScalar(scale));

      camera.position.z = 2;

      function animate() {
        requestAnimationFrame(animate);
        gltf.scene.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();
    });

    return {
      destroy() {
        renderer.dispose();
      }
    };
  }

  function getFileIcon(fileExtension: string): string {
    switch (fileExtension) {
      case 'pdf':
        return '📄';
      case 'pptx':
        return '📊';
      case 'epub':
        return '📚';
      default:
        return '📁';
    }
  }
</script>

<Toaster />

<TabItem open={tabBoolean}>
	<span slot="title">{tabName}</span>
	<div
		class="m-4 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
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
    <div class="mx-4 my-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {#each filteredItems as material (material.id)}
        <div class="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-lg dark:bg-gray-800 dark:shadow-gray-700">
          <div class="relative aspect-[5/6.455] overflow-hidden bg-gray-100 dark:bg-gray-700">
            {#if is3DObject(getFileExtension(material.file_path))}
              <canvas
                class="absolute inset-0 h-full w-full object-contain"
                use:initThreeJsPreview={material.file_path}
              ></canvas>
            {:else}
              <div class="flex h-full items-center justify-center">
                <span class="text-6xl text-gray-400">{getFileIcon(getFileExtension(material.file_path))}</span>
              </div>
            {/if}
          </div>
          <div class="flex flex-1 flex-col p-4">
            <!-- ... (rest of the card content) -->
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