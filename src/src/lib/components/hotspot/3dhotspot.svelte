<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	//import { P } from 'flowbite-svelte';
	import { tweened } from 'svelte/motion';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { Label, Select } from 'flowbite-svelte';
	import { TransformControls } from 'three/addons/controls/TransformControls.js';
	//import Menu from './3dMenu.svelte';
	import { useProgress } from '@threlte/extras';

	import { selectedModel, spherePosition } from '$lib/store/model';

	export let data: {
		role: string;
		models: { title: string; file_path: string; description: string }[];
		questions: {
			id: string;
			questionNumber: number;
			questionContent: string;
			questionPoints: number;
			questionType: string;
			modelPath: string;
			options: { content: string; points: number }[] | null;
		}[];
	};
	let selected: string;
	export let materials: any[];

	let { role, questions } = data;

	let canvas: HTMLCanvasElement;
	let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
	let controls: OrbitControls;

	let draggableSphere: THREE.Mesh;
	let transformControls: TransformControls;
	let currentModel: THREE.Object3D | null = null;

	let loadingProgress = tweened(0, { duration: 500 });
	let isLoading = false;
	let { progress } = useProgress();

	onMount(() => {
		initScene();
		animate();
	});

	function initScene() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 5;

		renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xffffff);

		// Add lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 1.9);
		directionalLight.castShadow = true;
		directionalLight.shadow.radius = 4;
		scene.add(directionalLight);

		// Add point lights
		const pointLight1 = new THREE.PointLight(0xffffff, 1.9);
		pointLight1.position.set(0, 5, 5);
		pointLight1.castShadow = true;
		scene.add(pointLight1);

		const pointLight2 = new THREE.PointLight(0xffffff, 1.9);
		pointLight2.position.set(0, -5, 5);
		pointLight2.castShadow = true;
		scene.add(pointLight2);

		const pointLight3 = new THREE.PointLight(0xffffff, 1.9);
		pointLight3.position.set(5, 5, 0);
		pointLight3.castShadow = true;
		scene.add(pointLight3);

		const pointLight4 = new THREE.PointLight(0xffffff, 1.9);
		pointLight4.position.set(-5, -5, 0);
		pointLight3.castShadow = true;
		scene.add(pointLight4);

		const pointLight5 = new THREE.PointLight(0xffffff, 1.9);
		pointLight5.position.set(0, 0, -5);
		pointLight5.castShadow = true;
		scene.add(pointLight5);

		if (role === 'lecturer') {
			// Create a draggable sphere
			const sphereGeometry = new THREE.SphereGeometry(0.1);
			const sphereMaterial = new THREE.MeshBasicMaterial({
				color: 0xb604f6,
				transparent: false,
				opacity: 1
			});
			draggableSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			draggableSphere.position.set(1, 1, 0);
			scene.add(draggableSphere);

			// Initialize TransformControls for the sphere
			transformControls = new TransformControls(camera, renderer.domElement);
			transformControls.attach(draggableSphere);
			transformControls.setMode('translate');
			scene.add(transformControls);

			//sphere transform
			transformControls.addEventListener('mouseDown', () => {
				controls.enabled = false;
			});
			transformControls.addEventListener('mouseUp', () => {
				controls.enabled = true;
				$spherePosition.copy(draggableSphere.position);
			});
		} else if (role === 'student') {
			questions.forEach((question) => {
				if (question.modelPath) {
					loadModel(question.modelPath);
				}
			});

			const pinGeometry = new THREE.SphereGeometry(0.05);
			const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
			const pin = new THREE.Mesh(pinGeometry, pinMaterial);

			pin.position.set(0, 1, 0);
			scene.add(pin);

			transformControls = new TransformControls(camera, renderer.domElement);
			transformControls.attach(pin);
			transformControls.setMode('translate');
			scene.add(transformControls);

			//pin transform
			transformControls.addEventListener('mouseDown', () => {
				controls.enabled = false;
			});
			transformControls.addEventListener('mouseUp', () => {
				controls.enabled = true;
				$spherePosition.copy(pin.position);
			});
		}

		// Initialize OrbitControls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableRotate = true;
		controls.autoRotate = false;
		controls.autoRotateSpeed = 2.0;

		window.addEventListener('resize', onWindowResize, false);
	}

	function loadModel(file_path: string) {
		isLoading = true;
		const loader = new GLTFLoader();
		loader.load(
			file_path,
			(gltf) => {
				if (currentModel) {
					scene.remove(currentModel);
				}
				currentModel = gltf.scene;
				scene.add(currentModel);
				isLoading = false;
			},
			(xhr) => {
				loadingProgress.set((xhr.loaded / xhr.total) * 100);
			},
			() => {
				console.error('An error occurred loading the model');
				isLoading = false;
			}
		);
	}

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function handleModelSelection() {
		loadModel(selected);
		selectedModel.set(selected);
	}
</script>

{#if isLoading}
	<div class="loading-container">
		<div class="loading-bar" style="width: {progress}%"></div>
		<p>Loading model: {progress}%</p>
	</div>
{/if}

{#if role === 'lecturer'}
	<!-- <div class="flex items-center space-x-4">
		<Menu {models} onModelSelect={handleModelSelection} />
		<P class=" font-semibold text-violet-700">
			Note: Open the menu to select a model, then use the transform controls on the violet sphere
			to drag it to your desired point.
		</P>
	</div> -->
	<Label>
		Select a 3D object:
		<Select class="my-2" bind:value={selected} on:change={handleModelSelection}>
			{#each materials as option}
				<option value={option.file_path}>{option.title}</option>
			{/each}
		</Select>
	</Label>
{/if}

<div class="scene-wrapper">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.scene-wrapper {
		position: relative;
		width: 100%;
		height: 100vh;
	}

	canvas {
		width: 100%;
		height: calc(100vh / 4);
		max-width: 100%;
		object-fit: contain;
	}

	.loading-container {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
		background-color: rgba(255, 255, 255, 0.8);
		padding: 20px;
		border-radius: 10px;
	}

	.loading-bar {
		height: 10px;
		background-color: #4caf50;
		border-radius: 5px;
		margin-bottom: 10px;
	}
</style>
