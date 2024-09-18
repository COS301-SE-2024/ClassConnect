<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
	import Menu from '$lib/components/hotspot/3dMenu.svelte';
	import { Button } from 'flowbite-svelte';
	

	let canvas: HTMLCanvasElement;
	let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
	let controls: OrbitControls;
	let labelRenderer: CSS2DRenderer;
	let raycaster: THREE.Raycaster;
	let mouse: THREE.Vector2;
	let annotationMode = false; // Toggle for annotation mode
	let annotationText = '';
	let activePoint: THREE.Vector3 | null = null;
	let tooltipX: number = 0;
	let tooltipY: number = 0;

	export let data: {
		role: string;
		models: { title: string; file_path: string; description: string }[];
	};

	let { models } = data;
	let selectedModel: string | null = null;
	const annotations: {
		[key: string]: { position: THREE.Vector3; text: string; labelDiv: HTMLDivElement };
	} = {};

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
		}
	}

	function createAnnotation(position: THREE.Vector3, text: string) {
		// Create a circle as a THREE.Sprite
		const circleTexture = new THREE.TextureLoader().load('/images/circle.png');
		const spriteMaterial = new THREE.SpriteMaterial({
			map: circleTexture,
			depthTest: false,
			depthWrite: false,
			sizeAttenuation: false
		});
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.position.copy(position);
		sprite.scale.set(0.05, 0.05, 0.05);
		scene.add(sprite);

		const labelDiv = document.createElement('div');
		labelDiv.className = 'annotation-label';
		labelDiv.textContent = text;
		const label = new CSS2DObject(labelDiv);
		label.position.copy(position);
		scene.add(label);

		annotations[text] = { position, text, labelDiv };
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
			activePoint = point;

			const vector = new THREE.Vector3();
			vector.copy(activePoint).project(camera);

			const canvas = renderer.domElement;
			const widthHalf = 0.5 * canvas.width;
			const heightHalf = 0.5 * canvas.height;

			tooltipX = vector.x * widthHalf + widthHalf;
			tooltipY = -(vector.y * heightHalf) + heightHalf;
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

		labelRenderer = new CSS2DRenderer();
		labelRenderer.setSize(window.innerWidth, window.innerHeight);
		labelRenderer.domElement.style.position = 'absolute';
		labelRenderer.domElement.style.top = '0';
		labelRenderer.domElement.style.pointerEvents = 'none';
		document.body.appendChild(labelRenderer.domElement);

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

		// Get the canvas's bounding rect
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const canvasWidth = rect.width;
		const canvasHeight = rect.height;

		Object.values(annotations).forEach(({ position, labelDiv }) => {
			const spriteScreenPosition = position.clone().project(camera);

			//  normalized coordinates to pixel coordinates
			const widthHalf = canvasWidth / 2;
			const heightHalf = canvasHeight / 2;
			const spriteX = spriteScreenPosition.x * widthHalf + widthHalf;
			const spriteY = -(spriteScreenPosition.y * heightHalf) + heightHalf;

			// Update the label's position
			labelDiv.style.position = 'absolute';
			labelDiv.style.left = `${spriteX + rect.left}px`;
			labelDiv.style.top = `${spriteY + rect.top}px`;

			console.log(`Sprite Position: ${spriteX}, ${spriteY}`);
			console.log(`Canvas Bounds: ${rect.left}, ${rect.top}, ${rect.width}, ${rect.height}`);

			// Show/hide labels based on visibility
			if (
				spriteScreenPosition.z < 0 ||
				spriteX < 0 ||
				spriteX > canvasWidth ||
				spriteY < 0 ||
				spriteY > canvasHeight
			) {
				labelDiv.style.display = 'none';
			} else {
				labelDiv.style.display = 'block';
			}
		});

		// Render the scene and labels
		renderer.render(scene, camera);
		labelRenderer.render(scene, camera);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
		labelRenderer.setSize(window.innerWidth, window.innerHeight);
	}
</script>

<div class="scene-wrapper">
	<Menu {models} onModelSelect={handleModelSelection} />
	<Button on:click={toggleAnnotationMode}>
		{annotationMode ? 'Exit Annotation Mode' : 'Enter Annotation Mode'}
	</Button>
	<canvas bind:this={canvas}></canvas>

	<!-- Annotation input -->
	{#if annotationMode && activePoint}
		<div class="annotation-input" style="left: {tooltipX}px; top: {tooltipY}px;">
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
		width: 100px; /* Adjust width */
	}

	.annotation-input button {
		margin-top: 5px;
	}

	:global(.annotation-label) {
		background-color: rgba(41, 39, 39, 0.7);
		padding: 2px 5px;
		border-radius: 3px;
		font-size: 12px;
		pointer-events: none;
		user-select: none;
	}
</style>
