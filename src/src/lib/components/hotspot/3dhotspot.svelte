<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { P } from 'flowbite-svelte';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

	import { TransformControls } from 'three/addons/controls/TransformControls.js';
	import Menu from './3dMenu.svelte';
	import { selectedModel, modelSphereData, spherePosition } from '$lib/store/model';

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

	let { role, models, questions } = data;
	if (role === 'student') {
		console.log('Questions', questions);
	}

	let canvas: HTMLCanvasElement;
	let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
	let controls: OrbitControls;

	let draggableSphere: THREE.Mesh;
	let transformControls: TransformControls;
	let currentModel: THREE.Object3D | null = null;
	let isLoading = false;

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
				$spherePosition.copy(draggableSphere.position);
				modelSphereData.set({
					file_path: $selectedModel,
					position: draggableSphere.position.clone()
				});
			});
			transformControls.addEventListener('mouseUp', () => {
				controls.enabled = true;
				$spherePosition.copy(draggableSphere.position);
			});
		} else if (role === 'student') {
			//loadModel
			questions.forEach((question) => {
				if (question.modelPath) {
					loadModel(question.modelPath);
				}
			});

			// Create and add the new pin
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

	const loadingManager = new THREE.LoadingManager(
		() => {
			isLoading = false;
		},
		(itemUrl, itemsLoaded, itemsTotal) => {
			// Update progress
			console.log(`Loaded ${itemsLoaded} of ${itemsTotal}`);
		},
		(url) => {
			// Handle loading error
			console.error(`Error loading ${url}`);
		}
	);

	const loader = new GLTFLoader(loadingManager);

	function loadModel(file_path: string) {
		isLoading = true;
		loader.load(file_path, (gltf) => {
			if (currentModel) {
				scene.remove(currentModel);
			}
			currentModel = gltf.scene;
			scene.add(currentModel);
		});
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

	function handleModelSelection(file_path: string) {
		loadModel(file_path);
		selectedModel.set(file_path);
	}
</script>

<div class="scene-wrapper">
	{#if role === 'lecturer'}
		<div class="flex items-center space-x-4">
			<Menu {models} onModelSelect={handleModelSelection} />
			<P class=" font-semibold text-violet-700">
				Note: Use the transform controls on the violet sphere to drag it to your desired point.
			</P>
		</div>
	{/if}
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
</style>
