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
	let tooltipX: number = 0;
	let tooltipY: number = 0;

	export let data: {
		role: string;
		models: { title: string; file_path: string; description: string }[];
	};

	let { models } = data;
	let selectedModel: string | null = null;
	const annotations: {
		[key: string]: { position: THREE.Vector3; text: string };
	} = {};

	function toggleAnnotationMode() {
		annotationMode = !annotationMode;
		if (!annotationMode) {
			activePoint = null;
		}
	}

	function addAnnotation() {
		if (annotationText.trim() && activePoint) {
			createAnnotation(activePoint, annotationText);
			annotationText = '';
			activePoint = null;
		}
	}

	function createAnnotation(position: THREE.Vector3, text: string) {
		// Circle sprite with a number
		const circleCanvas = document.createElement('canvas');
		circleCanvas.width = 64;
		circleCanvas.height = 64;
		const ctx = circleCanvas.getContext('2d')!;
		const x = 32, y = 32, radius = 30;

		// Draw the black circle
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();

		// Draw the white border circle
		ctx.strokeStyle = "rgb(255, 255, 255)";
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.stroke();

		// Draw the number text in the center
		ctx.fillStyle = "rgb(255, 255, 255)";
		ctx.font = "32px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText("1", x, y);

		const circleTexture = new THREE.CanvasTexture(circleCanvas);
		const spriteMaterial = new THREE.SpriteMaterial({
			map: circleTexture,
			alphaTest: 0.5,
			transparent: true,
			depthTest: false,
			depthWrite: false
		});
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.position.copy(position);
		sprite.scale.set(0.1, 0.1, 0.1);
		scene.add(sprite);

		// Store annotation data
		annotations[text] = { position, text };

		// Now trigger a DOM element for the tooltip (similar to the example)
		const vector = new THREE.Vector3();
		vector.copy(position).project(camera);

		const canvas = renderer.domElement;
		const widthHalf = 0.5 * canvas.width;
		const heightHalf = 0.5 * canvas.height;

		tooltipX = vector.x * widthHalf + widthHalf;
		tooltipY = -(vector.y * heightHalf) + heightHalf;
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
		width: 100px;
	}

	.annotation-input button {
		margin-top: 5px;
	}
</style>
