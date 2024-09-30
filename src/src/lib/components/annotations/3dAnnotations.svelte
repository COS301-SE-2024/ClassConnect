<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import Menu from '$lib/components/hotspot/3dMenu.svelte';
	import { P } from 'flowbite-svelte';

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
	let currentModel: THREE.Object3D | null = null;

	export let data: {
		role: string;
		models: { title: string; file_path: string; description: string }[];
	};

	let { models } = data;

	const annotations: {
		[key: string]: {
			position: THREE.Vector3;
			text: string;
			labelDiv: HTMLDivElement;
			sprite: THREE.Sprite;
		};
	} = {};

	function toggleAnnotationMode() {
		if (data.role === 'lecturer') {
			annotationMode = true;
		} else if (data.role === 'student') {
			annotationMode = false;
		}

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

		// Create the label element
		const labelDiv = document.createElement('div');
		labelDiv.style.backgroundColor = 'rgba(30, 30, 30, 0.9)';
		labelDiv.style.padding = '2px 5px';
		labelDiv.style.borderRadius = '3px';
		labelDiv.style.fontSize = '12px';
		labelDiv.style.color = 'white';
		labelDiv.style.fontWeight = 'bold';
		labelDiv.style.pointerEvents = 'none';
		labelDiv.style.userSelect = 'none';
		labelDiv.style.zIndex = '1000';
		labelDiv.textContent = text;
		document.body.appendChild(labelDiv);

		annotations[text] = { position, text, labelDiv, sprite };
	}

	function removeAnnotation(text: string) {
		const annotation = annotations[text];
		console.log('Removing annotation', annotation.labelDiv);
		if (annotation && annotation.labelDiv.parentNode) {
			console.log('Removing annotation', annotation.labelDiv);
			annotation.labelDiv.remove();
			scene.remove(annotation.sprite);
			delete annotations[text];
		}
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
	function handleBeforeUnload() {
		removeAllAnnotations();
	}

	onMount(() => {
		initScene();
		animate();
		toggleAnnotationMode();
		const urlParams = new URLSearchParams(window.location.search);
		const modelPath = urlParams.get('model');

		if (modelPath) {
			loadModel(modelPath);
		}
		window.addEventListener('click', onMouseClick);
		window.addEventListener('beforeunload', handleBeforeUnload);

		document.addEventListener('removeAllAnnotations', () => {
			Object.keys(annotations).forEach((text) => {
				removeAnnotation(text);
			});
		});
		return () => {
			window.removeEventListener('beforeunload', handleBeforeUnload);
			window.removeEventListener('click', onMouseClick);
		};
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

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
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
			if (currentModel) {
				scene.remove(currentModel);
			}
			currentModel = gltf.scene;
			scene.add(currentModel);
		});
	}

	function removeAllAnnotations() {
		console.log('removeAllAnnotations called');
		Object.keys(annotations).forEach((text) => {
			removeAnnotation(text);
		});
	}

	function handleModelSelection(file_path: string) {
		removeAllAnnotations();
		loadModel(file_path);
	}

	function animate() {
		requestAnimationFrame(animate);
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();
		const canvasWidth = rect.width;
		const canvasHeight = rect.height;

		Object.values(annotations).forEach(({ position, labelDiv }) => {
			const spriteScreenPosition = position.clone().project(camera);

			const widthHalf = canvasWidth / 2;
			const heightHalf = canvasHeight / 2;
			const spriteX = spriteScreenPosition.x * widthHalf + widthHalf;
			const spriteY = -(spriteScreenPosition.y * heightHalf) + heightHalf;

			labelDiv.style.position = 'fixed';
			labelDiv.style.left = `${spriteX + rect.left}px`;
			labelDiv.style.top = `${spriteY + rect.top}px`;

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

		renderer.render(scene, camera);
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}
</script>

<div class="scene-wrapper">
	<div class="flex items-center space-x-4">
		<Menu {models} onModelSelect={handleModelSelection} />
		<P class=" font-semibold text-violet-700">
			Tip: Open on the Menu to choose your model, then click on the desired location to add
			annotations.
		</P>
	</div>
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
