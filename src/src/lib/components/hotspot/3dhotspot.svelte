<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
	import Menu from './3dMenu.svelte';

	export let data: {
		role: string;
		models: { title: string; file_path: string; description: string }[];
	};

	let { models } = data;
	let selectedModel: string | null = null;
	let canvas: HTMLCanvasElement;
	let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
	let controls: OrbitControls;
	let dragControls: DragControls;
	let draggableSphere: THREE.Mesh;
	let spherePosition: THREE.Vector3 = new THREE.Vector3();
	let pinPos: THREE.Vector3 = new THREE.Vector3();

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
		const ambientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.set(1, 1, 1).normalize();
		scene.add(directionalLight);

		if (data.role === 'lecturer') {
			// Create a draggable sphere
			const sphereGeometry = new THREE.SphereGeometry(0.1);
			const sphereMaterial = new THREE.MeshBasicMaterial({
				color: 0x0000ff,
				transparent: true,
				opacity: 0.7
			});
			draggableSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			draggableSphere.position.set(1, 1, 0);
			scene.add(draggableSphere);

			//sphere drag
			dragControls = new DragControls([draggableSphere], camera, renderer.domElement);
			dragControls.addEventListener('dragstart', () => {
				controls.enabled = false;
			});
			dragControls.addEventListener('dragend', () => {
				controls.enabled = true;
				spherePosition.copy(draggableSphere.position);
				console.log('Sphere Position:', spherePosition);
				localStorage.setItem('spherePosition', JSON.stringify(draggableSphere.position.toArray()));
			});
		} else if (data.role === 'student') {
			// Create and add the new pin
			const pinGeometry = new THREE.SphereGeometry(0.05);
			const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
			const pin = new THREE.Mesh(pinGeometry, pinMaterial);

			pin.position.set(0, 1, 0);
			scene.add(pin);

			const pinDragControls = new DragControls([pin], camera, renderer.domElement);
			pinDragControls.addEventListener('dragstart', () => {
				controls.enabled = false;
			});
			pinDragControls.addEventListener('dragend', () => {
				controls.enabled = true;
				pinPos.copy(pin.position);
				console.log('Pin placed at', pin.position);
				checkProximity(pin);
			});
		}

		// Initialize OrbitControls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableRotate = true;
		controls.autoRotate = false;
		controls.autoRotateSpeed = 2.0;

		// Load the model based on role
		if (data.role === 'student') {
			const storedModel = localStorage.getItem('selectedModel');
			if (storedModel) {
				loadModel(storedModel);
			}
		}

		window.addEventListener('resize', onWindowResize, false);
	}

	function loadModel(file_path: string) {
		const loader = new GLTFLoader();
		loader.load(file_path, (gltf) => {
			scene.add(gltf.scene);
		});
	}

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
		renderer.render(scene, camera);
	}

	function getSavedSpherePosition(): THREE.Vector3 {
		const savedPosition = localStorage.getItem('spherePosition');
		if (savedPosition) {
			const [x, y, z] = JSON.parse(savedPosition);
			return new THREE.Vector3(x, y, z);
		}
		return new THREE.Vector3();
	}

	function checkProximity(pin: THREE.Mesh) {
		const savedSpherePosition = getSavedSpherePosition();
		const distance = pin.position.distanceTo(savedSpherePosition);
		const isCorrect = distance <= 0.2;
		localStorage.setItem('Distance', JSON.stringify(distance));

		return isCorrect;
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function handleModelSelection(file_path: string) {
		selectedModel = file_path;
		localStorage.setItem('selectedModel', selectedModel);
		loadModel(file_path);
	}
</script>

<div class="scene-wrapper">
	<canvas bind:this={canvas}></canvas>
	{#if data.role === 'lecturer'}
		<div class="menu-container">
			<Menu {models} onModelSelect={handleModelSelection} />
		</div>
	{/if}
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

	.menu-container {
		position: absolute;
		top: 0; /* Adjust as needed to align with the top of the canvas */
		left: 0; /* Adjust as needed to align with the left of the canvas */
		z-index: 10; /* Ensure it's on top of the canvas */
		padding: 20px; /* Add padding if you want spacing from the edges */
	}
</style>
