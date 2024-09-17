<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import Menu from '$lib/components/hotspot/3dMenu.svelte';
	import { Button } from 'flowbite-svelte';
	import { Textarea } from 'flowbite-svelte';

	let canvas: HTMLCanvasElement;
	let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
	let controls: OrbitControls;
	let raycaster: THREE.Raycaster;
	let mouse: THREE.Vector2;
	let annotationMode = false;
	let annotationText = '';
	let activePoint: THREE.Vector3 | null = null;
	let showTextField = false;
	let textFieldX = 0;
	let textFieldY = 0;

	export let data: {
		role: string;
		models: { title: string; file_path: string; description: string }[];
	};

	let { models } = data;
	let selectedModel: string | null = null;

	function toggleAnnotationMode() {
		annotationMode = !annotationMode;
		if (!annotationMode) {
			activePoint = null; // Clear active point when exiting annotation mode
		}
	}

	function addAnnotation() {
		if (annotationText.trim() && activePoint) {
			createAnnotation(activePoint, annotationText);
			annotationText = ''; // Clear text after adding
			activePoint = null; // Clear active point
			showTextField = false; // Hide text field after adding annotation
		}
	}

	function createAnnotation(position: THREE.Vector3, text: string) {
		const geometry = new THREE.CircleGeometry(0.05, 32); // Circle radius 0.05 units
		const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		const circle = new THREE.Mesh(geometry, material);
		circle.position.copy(position);
		scene.add(circle);

		// Create a Sprite with text for the annotation
		const spriteMaterial = new THREE.SpriteMaterial({
			map: createTextureWithText(text),
			transparent: true
		});
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.position.copy(position).add(new THREE.Vector3(0.5, 0.1, 0));
		sprite.scale.set(0.5, 0.5, 0.5);
		scene.add(sprite);
	}

	function createTextureWithText(text: string): THREE.Texture {
		const canvas = document.createElement('canvas');
		const ctx = canvas.getContext('2d');
		canvas.width = 256;
		canvas.height = 128;
		if (ctx) {
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = 'black';
			ctx.font = '20px Arial';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(text, canvas.width / 2, canvas.height / 2);
		}
		return new THREE.CanvasTexture(canvas);
	}

	function onMouseClick(event: MouseEvent) {
		if (!annotationMode) return;

		const rect = canvas.getBoundingClientRect();
		mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
		mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);
		const intersects = raycaster.intersectObjects(scene.children, true);

		if (intersects.length > 0) {
			const point = intersects[0].point;
			textFieldX = event.clientX;
			textFieldY = event.clientY;
			activePoint = point;
			showTextField = true; // Show text field for annotation input
		}
	}

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
</script>

<div class="scene-wrapper">
	<Menu {models} onModelSelect={handleModelSelection} />
	<Button on:click={toggleAnnotationMode}>
		{annotationMode ? 'Exit Annotation Mode' : 'Enter Annotation Mode'}
	</Button>
	<canvas bind:this={canvas}></canvas>

	<!-- Annotation input -->
	{#if annotationMode && showTextField}
		<div class="annotation-input" style="left: {textFieldX}px; top: {textFieldY}px;">
			<Textarea bind:value={annotationText} placeholder="Enter annotation" rows={2} />
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
		padding: 10px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	.annotation-input button {
		width: 100%;
	}
</style>
