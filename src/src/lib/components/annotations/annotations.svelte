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
	let annotations: {
		[key: string]: { position: THREE.Vector3; text: string; element: HTMLDivElement; sprite: THREE.Sprite };
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
		const annotationElement = document.createElement('div');
		annotationElement.className = 'annotation';
		annotationElement.innerHTML = `
			<p><strong>${text}</strong></p>
			<p>${text}</p>
		`;
		document.body.appendChild(annotationElement);

		const sprite = createAnnotationSprite();
		sprite.position.copy(position);
		scene.add(sprite);

		annotations[text] = { position, text, element: annotationElement, sprite };
	}

	function createAnnotationSprite(): THREE.Sprite {
		const canvas = document.createElement('canvas');
		canvas.width = 64;
		canvas.height = 64;
		const context = canvas.getContext('2d');
		
		if (context) {
			context.fillStyle = "rgb(0, 0, 0)";
			context.beginPath();
			context.arc(32, 32, 30, 0, Math.PI * 2);
			context.fill();

			context.strokeStyle = "rgb(255, 255, 255)";
			context.lineWidth = 3;
			context.beginPath();
			context.arc(32, 32, 30, 0, Math.PI * 2);
			context.stroke();

			context.fillStyle = "rgb(255, 255, 255)";
			context.font = "32px sans-serif";
			context.textAlign = "center";
			context.textBaseline = "middle";
			context.fillText(Object.keys(annotations).length.toString(), 32, 32);
		}

		const texture = new THREE.CanvasTexture(canvas);
		const spriteMaterial = new THREE.SpriteMaterial({
			map: texture,
			alphaTest: 0.5,
			transparent: true,
			depthTest: false,
			depthWrite: false
		});

		return new THREE.Sprite(spriteMaterial);
	}

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

	onMount(() => {
		initScene();
		animate();

		window.addEventListener('click', onMouseClick);
	});

	function initScene() {
		// ... (keep your existing initScene code)
	}

	function loadModel(file_path: string) {
		// ... (keep your existing loadModel code)
	}

	function handleModelSelection(file_path: string) {
		// ... (keep your existing handleModelSelection code)
	}

	function animate() {
		requestAnimationFrame(animate);

		updateAnnotations();

		renderer.render(scene, camera);
	}

	function updateAnnotations() {
		Object.values(annotations).forEach(({ position, element, sprite }) => {
			const screenPosition = position.clone().project(camera);

			const widthHalf = window.innerWidth / 2;
			const heightHalf = window.innerHeight / 2;
			const x = (screenPosition.x * widthHalf) + widthHalf;
			const y = -(screenPosition.y * heightHalf) + heightHalf;

			element.style.left = `${x}px`;
			element.style.top = `${y}px`;

			// Update visibility
			const meshDistance = camera.position.distanceTo(scene.position);
			const spriteDistance = camera.position.distanceTo(sprite.position);
			const isBehindObject = spriteDistance > meshDistance;

			element.style.opacity = isBehindObject ? '0.25' : '1';
			sprite.material.opacity = isBehindObject ? 0.25 : 1;
		});
	}

	function onWindowResize() {
		// ... (keep your existing onWindowResize code)
	}
</script>

<div class="scene-wrapper">
	<Menu {models} onModelSelect={handleModelSelection} />
	<Button on:click={toggleAnnotationMode}>
		{annotationMode ? 'Exit Annotation Mode' : 'Enter Annotation Mode'}
	</Button>
	<canvas bind:this={canvas}></canvas>

	{#if annotationMode && activePoint}
		<div class="annotation-input">
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
		display: block;
	}

	.annotation-input {
		position: absolute;
		top: 10px;
		left: 10px;
		background: white;
		border: 1px solid black;
		padding: 5px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
		z-index: 1000;
	}

	:global(.annotation) {
		position: absolute;
		z-index: 1;
		margin-left: 15px;
		margin-top: 15px;
		padding: 1em;
		width: 200px;
		color: #fff;
		background: rgba(0, 0, 0, 0.8);
		border-radius: .5em;
		font-size: 12px;
		line-height: 1.2;
		transition: opacity .5s;
		pointer-events: none;
	}

	:global(.annotation::before) {
		content: attr(data-number);
		position: absolute;
		top: -30px;
		left: -30px;
		width: 30px;
		height: 30px;
		border: 2px solid #fff;
		border-radius: 50%;
		font-size: 16px;
		line-height: 30px;
		text-align: center;
		background: rgba(0, 0, 0, 0.8);
	}
</style>