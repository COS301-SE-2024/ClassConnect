<script lang="ts">
	import { Input, Label, Button, Select, Modal, Textarea } from 'flowbite-svelte';
	import {
		ExclamationCircleOutline,
		TrashBinOutline,
		ArchiveArrowDownOutline,
		EditOutline,
		EditSolid
	} from 'flowbite-svelte-icons';
	import { onMount } from 'svelte';
	import toast, { Toaster } from 'svelte-french-toast';
	import { enhance } from '$app/forms';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

	export let materials: any[];
	export let annotations: any[];
	export let threeDMaterial: any;

	let selected: any;
	let editMode = false;

	let canvas: HTMLCanvasElement;
	let numberCanvases: HTMLCanvasElement[] = [];
	let annotationDivs: HTMLDivElement[] = [];

	let open = false;
	let DeleteAnnotation = false;
	let EditAnnotation = false;
	let CreateAnnotation = false;

	let error: string;
	let selectedAnnotation: any;

	let ann_x: number;
	let ann_y: number;
	let ann_z: number;

	let camera: THREE.PerspectiveCamera;
	let controls: OrbitControls;
	let scene: THREE.Scene;
	let renderer: THREE.WebGLRenderer;
	let sprites: THREE.Sprite[] = [];
	let model: THREE.Object3D;
	let spriteBehindObject: boolean[] = [];

	let raycaster: THREE.Raycaster;
	let mouse: THREE.Vector2;

	onMount(() => {
		console.log('ThreeDMaterial', threeDMaterial);
		initThree();
		loadModel();
		initNumbers();
		animate();

		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();

		canvas.addEventListener('click', onCanvasClick);

		return () => {
			renderer.dispose();
			controls.dispose();
			canvas.removeEventListener('click', onCanvasClick);
		};
	});

	function initThree() {
		const container = document.querySelector('#model-container');
		if (!container) return;
		const containerRect = container.getBoundingClientRect();

		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf0f0f0);

		const aspect = containerRect.width / containerRect.height;
		camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);

		renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
		renderer.setSize(containerRect.width, containerRect.height);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.screenSpacePanning = false;
		controls.maxPolarAngle = Math.PI / 2;

		const ambientLight = new THREE.AmbientLight(0xffffff, 3.5);
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 3.5);
		directionalLight.position.set(0, 1, 0);
		scene.add(directionalLight);

		window.addEventListener('resize', onWindowResize, false);
	}

	function loadModel() {
		const loader = new GLTFLoader();
		loader.load(
			threeDMaterial.link,
			(gltf) => {
				model = gltf.scene;
				scene.add(model);

				const box = new THREE.Box3().setFromObject(model);
				const center = box.getCenter(new THREE.Vector3());
				model.position.sub(center);

				const size = box.getSize(new THREE.Vector3());
				const maxDim = Math.max(size.x, size.y, size.z);
				const fov = camera.fov * (Math.PI / 180);
				let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
				cameraZ *= 1.5;
				camera.position.set(cameraZ, cameraZ, cameraZ);
				camera.updateProjectionMatrix();

				controls.target.set(0, 0, 0);
				controls.update();
			},
			undefined,
			(error) => {
				console.error('An error happened', error);
			}
		);
	}

	function initNumbers() {
		annotations.forEach((annotation, index) => {
			const ctx = numberCanvases[index].getContext('2d');
			if (!ctx) return;

			const x = 32;
			const y = 32;
			const radius = 30;
			const startAngle = 0;
			const endAngle = Math.PI * 2;

			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.beginPath();
			ctx.arc(x, y, radius, startAngle, endAngle);
			ctx.fill();

			ctx.strokeStyle = 'rgb(255, 255, 255)';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(x, y, radius, startAngle, endAngle);
			ctx.stroke();

			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.font = '32px sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(index.toString(), x, y);
		});
	}

	function onWindowResize() {
		const container = document.querySelector('#model-container');
		if (!container) return;
		const containerRect = container.getBoundingClientRect();

		camera.aspect = containerRect.width / containerRect.height;
		camera.updateProjectionMatrix();
		renderer.setSize(containerRect.width, containerRect.height);
	}

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
		render();
	}

	function render() {
		renderer.render(scene, camera);
		updateAnnotationPositions();
		updateAnnotationOpacities();
		updateScreenPositions();
	}

	function updateAnnotationPositions() {
		annotations.forEach((annotation, index) => {
			const worldPosition = new THREE.Vector3(annotation.x, annotation.y, annotation.z);
			const screenPosition = worldPosition.project(camera);

			const canvas = renderer.domElement;
			const x = (screenPosition.x * 0.5 + 0.5) * canvas.width;
			const y = (-screenPosition.y * 0.5 + 0.5) * canvas.height;

			if (annotationDivs[index]) {
				annotationDivs[index].style.transform = `translate(${x}px, ${y}px)`;
				annotationDivs[index].style.display = screenPosition.z < 1 ? 'block' : 'none';
			}

			if (numberCanvases[index]) {
				numberCanvases[index].style.transform = `translate(${x - 32}px, ${y - 32}px)`;
				numberCanvases[index].style.display = screenPosition.z < 1 ? 'block' : 'none';
			}
		});
	}

	function updateAnnotationOpacities() {
		sprites.forEach((sprite, index) => {
			const meshDistance = camera.position.distanceTo(new THREE.Vector3());
			const spriteDistance = camera.position.distanceTo(sprite.position);
			spriteBehindObject[index] = spriteDistance > meshDistance;
			sprite.material.opacity = spriteBehindObject[index] ? 0.25 : 1;
		});
	}

	function updateScreenPositions() {
		annotations.forEach((annotation, index) => {
			const vector = new THREE.Vector3(annotation.x, annotation.y, annotation.z);
			const canvas = renderer.domElement;

			vector.project(camera);

			vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
			vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

			annotationDivs[index].style.top = `${vector.y}px`;
			annotationDivs[index].style.left = `${vector.x}px`;
			annotationDivs[index].style.opacity = spriteBehindObject[index] ? '0.1' : '1';
		});
	}

	function onCanvasClick(event: MouseEvent) {
		const rect = canvas.getBoundingClientRect();
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		if (model) {
			const intersects = raycaster.intersectObject(model, true);

			if (intersects.length > 0) {
				const point = intersects[0].point;
				console.log('Clicked point:', point);
				addNewAnnotation(point);
			}
		}
	}

	function addNewAnnotation(point: THREE.Vector3) {
		if (!editMode) return;
		ann_x = point.x;
		ann_y = point.y;
		ann_z = point.z;
		CreateAnnotation = true;
	}

	function save() {
		const toastId = toast.loading('Saving 3D notes...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Saved successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Deletion Failed!: ' + error);
			}
		};
	}

	function edit() {
		const toastId = toast.loading('Editing annotation...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Edited successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Edit failed!: ' + error);
			}
		};
	}

	function change() {
		const toastId = toast.loading('Changing 3D object...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Changed successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Change Failed!: ' + error);
			}
		};
	}

	function create() {
		CreateAnnotation = false;
		const toastId = toast.loading('Creating annotation...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Created successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Creation Failed!: ' + error);
			}
		};
	}

	function remove() {
		const toastId = toast.loading('Deleting 3D notes...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Deleted successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Deletion Failed!: ' + error);
			}
		};
	}

	function deleteAnnotation() {
		DeleteAnnotation = false;
		const toastId = toast.loading('Deleting annotation...');
		return async ({ result, update }: any) => {
			if (result.type === 'success') {
				await update();
				toast.dismiss(toastId);
				toast.success('Deleted successfully');
			} else {
				error = result.data?.error;
				toast.dismiss(toastId);
				toast.error('Deletion Failed!: ' + error);
			}
		};
	}

	function handleEdit(annotation: any) {
		selectedAnnotation = annotation;
		EditAnnotation = true;
	}

	function handleDelete(annotation: any) {
		selectedAnnotation = annotation;
		DeleteAnnotation = true;
	}

	function clickChangeThreeDObjBtn() {
		const button = document.getElementById('changeThreeDObjBtn');
		if (button) {
			button.click();
		}
	}

	function clickEditContentDetailsBtn() {
		const button = document.getElementById('editContentDetailsBtn');
		if (button) {
			button.click();
		}
	}
</script>

<Toaster />

<main class="container mx-auto p-4">
	<div class="p-2 md:px-5 md:py-2">
		<div class="grid grid-cols-12 gap-6">
			<div class="col-span-2">
				<div
					class="w-48 justify-center rounded-lg border border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				>
					<div
						class="relative inline-flex w-full items-center justify-center rounded-t-lg border-b border-gray-200 px-4 py-2 text-sm font-medium focus:z-10 focus:text-green-700 focus:ring-2 focus:ring-green-700 dark:border-gray-600 dark:focus:text-white dark:focus:ring-gray-500"
					>
						Annotations
					</div>
					{#each annotations as annotation}
						<div class="relative inline-flex w-full items-center px-4 py-2 text-sm font-medium">
							<span>{annotation.title}</span>
							<div class="ml-auto flex">
								<button
									type="button"
									on:click={() => handleEdit(annotation)}
									class="mr-2 text-gray-500 hover:text-green-500"
								>
									<EditOutline />
									<span class="sr-only">Edit Annotation</span>
								</button>
								<button
									type="button"
									on:click={() => handleDelete(annotation)}
									class="text-gray-500 hover:text-red-500"
								>
									<TrashBinOutline />
									<span class="sr-only">Delete Annotation</span>
								</button>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="col-span-8">
				<form method="POST" action="?/editContent" use:enhance={save}>
					<div>
						<div class="mb-6">
							<Label for="title" class="mb-2 text-2xl">Title</Label>
							<Input
								type="text"
								id="title"
								name="title"
								placeholder={threeDMaterial.title}
								value={threeDMaterial.title}
							/>
						</div>
						<div class="mb-6">
							<Label for="description" class="mb-2 text-2xl">Description</Label>
							<Input
								type="text"
								id="description"
								name="description"
								placeholder={threeDMaterial.description}
								value={threeDMaterial.description}
							/>
						</div>
						<div>
							<div class="flex justify-center p-3">
								<section
									class="relative flex h-[500px] w-[900px] flex-col space-y-4 rounded-lg bg-gray-200 p-2 shadow-md ring dark:bg-gray-700"
								>
									<div id="model-container" class="relative flex-1 overflow-hidden">
										<canvas bind:this={canvas} class="absolute inset-0 h-full w-full"></canvas>

										{#each annotations as annotation, i}
											<div
												bind:this={annotationDivs[i]}
												class="absolute z-10 w-48 rounded-lg bg-black bg-opacity-80 p-4 text-xs leading-tight text-white transition-opacity duration-500 before:content-['{i}'] before:absolute before:-left-8 before:-top-8 before:h-8 before:w-8 before:rounded-full before:border-2 before:border-white before:bg-black before:bg-opacity-80 before:text-center before:text-base before:leading-8"
											>
												<p class="mb-2 font-bold">{annotation.title}</p>
												<p>{annotation.content}</p>
											</div>
											<canvas
												bind:this={numberCanvases[i]}
												width="64"
												height="64"
												class="absolute -z-10"
											></canvas>
										{/each}
									</div>
								</section>
							</div>
						</div>
						<Input type="hidden" id="id" name="id" value={threeDMaterial.id} />
						<Button id="editContentDetailsBtn" type="submit" class="mt-4 hidden">Save</Button>
					</div>
				</form>
				<form method="POST" action="?/changeObject" use:enhance={change}>
					<Label>
						Change 3D object:
						<Select class="mt-2" bind:value={selected} on:change={clickChangeThreeDObjBtn}>
							{#each materials as option}
								<option value={option.id}>{option.title}</option>
							{/each}
						</Select>
					</Label>
					<Input type="hidden" id="material" name="material" value={selected} />
					<Input type="hidden" id="id" name="id" value={threeDMaterial.id} />
					<Button id="changeThreeDObjBtn" type="submit" class="mt-4 hidden">Change 3D object</Button
					>
				</form>
			</div>
			<div class="col-span-2">
				<div
					class="w-48 justify-center rounded-lg border border-gray-200 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
				>
					<div
						class="relative inline-flex w-full items-center justify-center rounded-t-lg border-b border-gray-200 px-4 py-2 text-sm font-medium focus:z-10 focus:text-green-700 focus:ring-2 focus:ring-green-700 dark:border-gray-600 dark:focus:text-white dark:focus:ring-gray-500"
					>
						Actions
					</div>
					<button
						type="button"
						on:click={() => (editMode = !editMode)}
						class="relative inline-flex w-full items-center rounded-b-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-green-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
					>
						{#if editMode}
							<EditSolid class="mr-2 text-red-500" />
							<span class="text-red-500"> Turn off edit mode </span>
						{:else}
							<EditSolid class="mr-2 text-green-500" />
							<span class="text-green-500"> Turn on edit mode </span>
						{/if}
					</button>
					<button
						type="button"
						on:click={() => (open = true)}
						class="hover:text-red-700dark:border-gray-600 relative inline-flex w-full items-center border-b border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-red-700 dark:hover:bg-gray-600"
					>
						<TrashBinOutline
							class="mr-2 text-gray-500 transition-colors duration-200 hover:text-red-500"
						/>
						Remove 3D Material
					</button>
					<button
						type="button"
						on:click={clickEditContentDetailsBtn}
						class="relative inline-flex w-full items-center rounded-b-lg px-4 py-2 text-sm font-medium hover:bg-gray-100 hover:text-green-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
					>
						<ArchiveArrowDownOutline class="mr-2 text-gray-500" />
						Save 3D Material
					</button>
				</div>
			</div>
		</div>
	</div>
</main>

<Modal bind:open size="xs" class="text-center">
	<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		Are you sure you want to delete this notes slide?
	</h3>

	{#if error}
		<p class="mt-2 text-center text-red-500">{error}</p>
	{/if}

	<form method="POST" action="?/deleteContent" use:enhance={remove}>
		<Input type="hidden" id="id" name="id" value={threeDMaterial.id} />
		<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
	</form>
</Modal>

<Modal bind:open={DeleteAnnotation} size="xs" class="text-center">
	<ExclamationCircleOutline class="mx-auto mb-4 h-12 w-12 text-gray-400 dark:text-gray-200" />

	<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
		Are you sure you want to delete this annotation?
	</h3>

	{#if error}
		<p class="mt-2 text-center text-red-500">{error}</p>
	{/if}

	<form method="POST" action="?/deleteAnnotation" use:enhance={deleteAnnotation}>
		<Input type="hidden" id="id" name="id" value={selectedAnnotation?.id} />
		<Button type="submit" color="red" class="me-2">Yes, I'm sure</Button>
	</form>
</Modal>

<Modal bind:open={EditAnnotation} size="xs" class="w-full">
	<form method="POST" action="?/editAnnotation" class="flex flex-col" use:enhance={edit}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Edit Annotation</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Label for="title" class="mb-2 mt-2 text-left">Title</Label>
		<Input
			type="text"
			id="title"
			name="title"
			value={selectedAnnotation?.title}
			size="md"
			required
		/>

		<Label for="content" class="mb-2 mt-2 text-left">Content</Label>
		<Textarea
			id="content"
			name="content"
			value={selectedAnnotation?.description}
			size="md"
			required
		/>
		<Input type="hidden" id="id" name="id" value={selectedAnnotation?.id} />
		<Button type="submit" class="mt-4 w-full">Edit annotation</Button>
	</form>
</Modal>

<Modal bind:open={CreateAnnotation} size="xs" class="w-full">
	<form method="POST" action="?/createAnnotation" class="flex flex-col" use:enhance={create}>
		<h3 class="mb-4 text-xl font-medium text-gray-900 dark:text-white">Create Annotation</h3>

		{#if error}
			<p class="mt-2 text-center text-red-500">{error}</p>
		{/if}

		<Label for="title" class="mb-2 mt-2 text-left">Title</Label>
		<Input type="text" id="title" name="title" value="Title" size="md" required />

		<Label for="content" class="mb-2 mt-2 text-left">Content</Label>
		<Textarea id="content" name="content" value="Content" size="md" required />

		<Input type="hidden" id="x" name="x" value={ann_x} />
		<Input type="hidden" id="y" name="y" value={ann_y} />
		<Input type="hidden" id="z" name="z" value={ann_z} />

		<Input type="hidden" id="material" name="material" value={threeDMaterial.material} />

		<Button type="submit" class="mt-4 w-full">Create annotation</Button>
	</form>
</Modal>
