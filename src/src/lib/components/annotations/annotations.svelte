<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import Menu from '$lib/components/hotspot/3dMenu.svelte';
	import { Button } from 'flowbite-svelte';

	let canvas: HTMLCanvasElement;
	let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
	let controls: OrbitControls;
	let raycaster: THREE.Raycaster;
	let mouse: THREE.Vector2;
	let annotationMode = false;
	let annotationText = '';
	let activePoint: THREE.Vector3 | null = null;

	export let data: {
		role: string;
		models: { title: string; file_path: string; description: string }[];
	};

	let { models } = data;
	let selectedModel: string | null = null;

	// This will store annotations
	const annotations: {
		[key: string]: { position: THREE.Vector3; text: string };
	} = {};

	// Toggle annotation mode
	function toggleAnnotationMode() {
		annotationMode = !annotationMode;
		if (!annotationMode) {
			activePoint = null;
		}
	}

	// Add an annotation based on the clicked point and entered text
	function addAnnotation() {
		if (annotationText.trim() && activePoint) {
			createAnnotation(activePoint, annotationText);
			annotationText = '';
			activePoint = null;
		}
	}

	// Create the annotation in the scene (use method from your friend)
	function createAnnotation(position: THREE.Vector3, text: string) {
		// Create a small red sphere at the annotation point
		const sphereGeometry = new THREE.SphereGeometry(0.05, 32, 32);
		const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		sphere.position.copy(position);
		scene.add(sphere);

		// Store annotation text and its position
		annotations[text] = { position, text };

        const annotationDiv = document.createElement('div');
        annotationDiv.style.position = 'absolute';
        annotationDiv.style.color = 'black';
        annotationDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
        annotationDiv.style.padding = '4px';
        annotationDiv.style.border = '1px solid black';
        annotationDiv.style.fontSize = '12px';
        annotationDiv.innerHTML = text;

		document.body.appendChild(annotationDiv);
		updateAnnotationPosition(annotationDiv, position);
	}

	// This function positions the 2D annotation correctly relative to the 3D point
	function updateAnnotationPosition(element: HTMLElement, position: THREE.Vector3) {
		const vector = position.clone().project(camera);
		const canvasBounds = canvas.getBoundingClientRect();

		const x = (vector.x * 0.5 + 0.5) * canvasBounds.width + canvasBounds.left;
		const y = -(vector.y * 0.5 - 0.5) * canvasBounds.height + canvasBounds.top;

		element.style.left = `${x}px`;
		element.style.top = `${y}px`;
	}

	// Handles mouse clicks to create an annotation
	function onMouseClick(event: MouseEvent) {
		if (!annotationMode) return;

		const rect = canvas.getBoundingClientRect();
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(scene.children, true);

		if (intersects.length > 0) {
			activePoint = intersects[0].point;
		}
	}

	// Initialize the scene
	onMount(() => {
		initScene();
		animate();

		window.addEventListener('click', onMouseClick);
	});

	function initScene() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 5;

		renderer = new THREE.WebGLRenderer({ canvas });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0xffffff);

		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();

		const ambientLight = new THREE.AmbientLight(0x404040);
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.set(1, 1, 1).normalize();
		scene.add(directionalLight);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableRotate = true;

		window.addEventListener('resize', onWindowResize, false);
	}

	function loadModel(file_path: string) {
		const loader = new GLTFLoader();
		loader.load(file_path, (gltf) => {
			scene.add(gltf.scene);
		});
	}

	function handleModelSelection(file_path: string) {
		selectedModel = file_path;
		localStorage.setItem('selectedModel', selectedModel);
		loadModel(file_path);
	}

	// Update the animation loop
	function animate() {
		requestAnimationFrame(animate);
		renderer.render(scene, camera);
		controls.update();
	}
	
	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
</script>

<div class="scene-wrapper">
	<Menu {models} onModelSelect={handleModelSelection} />
	<Button on:click={toggleAnnotationMode}>
		{annotationMode ? 'Exit Annotation Mode' : 'Enter Annotation Mode'}
	</Button>
	<canvas bind:this={canvas}></canvas>

	{#if annotationMode && activePoint}
		<div class="annotation-input" style="left: {activePoint.x}px; top: {activePoint.y}px;">
			<input type="text" bind:value={annotationText} placeholder="Enter annotation" />
			<button on:click={addAnnotation}>Add Annotation</button>
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

	.annotation-input {
		position: absolute;
		background: white;
		border: 1px solid black;
		padding: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}
	.annotation-input input {
		width: 100px;
	}

	.annotation-input button {
		margin-top: 5px;
	}
</style>
