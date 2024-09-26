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
		[key: string]: { circleSprite: THREE.Sprite; textSprite: THREE.Sprite };
	} = {};

	function toggleAnnotationMode() {
		annotationMode = !annotationMode;
		if (!annotationMode) {
			activePoint = null;
		}
	}

	function addAnnotation() {
		if (annotationText.trim() && activePoint) {
			const annotation = createAnnotation(scene, activePoint, annotationText);
			annotations[annotationText] = annotation;
			annotationText = '';
			activePoint = null;
		}
	}

	function createAnnotation(scene: THREE.Scene, position: THREE.Vector3, text: string) {
		// Create a circle sprite
		const circleTexture = new THREE.TextureLoader().load('/images/circle.png');
		const circleMaterial = new THREE.SpriteMaterial({
			map: circleTexture,
			depthTest: false,
			depthWrite: false,
			sizeAttenuation: false
		});
		const circleSprite = new THREE.Sprite(circleMaterial);
		circleSprite.position.copy(position);
		circleSprite.scale.set(0.03, 0.03, 0.03);
		scene.add(circleSprite);

		// Create a text sprite
		const textTexture = createTextTexture(text);
		const textMaterial = new THREE.SpriteMaterial({
			map: textTexture,
			depthTest: false,
			depthWrite: false,
			sizeAttenuation: false
		});
		const textSprite = new THREE.Sprite(textMaterial);

		// Add slight offset to text sprite position
		textSprite.position.copy(position);
		textSprite.position.x += 0.2;
		textSprite.position.y += 0.05;
		textSprite.position.z += 0.05;

		textSprite.scale.set(0.07, 0.07, 0.07); // Adjusted scale for smaller text
		scene.add(textSprite);

		return { circleSprite, textSprite };
	}

	function createTextTexture(text: string, fontSize: number = 16): THREE.Texture {
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		if (!context) throw new Error('Unable to get 2D context');

		context.font = `${fontSize}px Arial`;
		const textMetrics = context.measureText(text);
		const textWidth = Math.ceil(textMetrics.width);
		const textHeight = fontSize;

		canvas.width = textWidth + 20; // Add more padding
		canvas.height = textHeight + 16; // Add more padding

		// Create rounded rectangle
		const radius = 8; // Corner radius
		context.beginPath();
		context.moveTo(radius, 0);
		context.lineTo(canvas.width - radius, 0);
		context.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
		context.lineTo(canvas.width, canvas.height - radius);
		context.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
		context.lineTo(radius, canvas.height);
		context.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
		context.lineTo(0, radius);
		context.quadraticCurveTo(0, 0, radius, 0);
		context.closePath();

		// Fill with darker background
		context.fillStyle = 'rgba(20, 20, 20, 0.95)';
		context.fill();

		// Add text
		context.font = `${fontSize}px Arial`;
		context.fillStyle = 'white';
		context.textAlign = 'center';
		context.textBaseline = 'middle';
		context.fillText(text, canvas.width / 2, canvas.height / 2);

		const texture = new THREE.Texture(canvas);
		texture.needsUpdate = true;
		return texture;
	}

	function removeAnnotation(text: string) {
		const annotation = annotations[text];
		if (annotation) {
			scene.remove(annotation.circleSprite);
			scene.remove(annotation.textSprite);
			delete annotations[text];
		}
	}

	function removeAllAnnotations() {
		Object.keys(annotations).forEach((text) => {
			removeAnnotation(text);
		});
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
		removeAllAnnotations();
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
		height: 100vh;
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
