<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	// import { XRSession, XRInputSourceEvent } from 'webxr';
	import type { LessonThreeDMaterial } from '$src/types';

	export let material: LessonThreeDMaterial;

	let containerElement: HTMLElement;
	let startARButton: HTMLButtonElement;

	let renderer: THREE.WebGLRenderer;
	let scene: THREE.Scene;
	let camera: THREE.PerspectiveCamera;
	let model: THREE.Object3D;
	let controls: OrbitControls;

	let isARSupported = false;

	onMount(() => {
		initScene();
		loadModel();
		checkARSupport();
	});

	function initScene() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.z = 5;

		renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		containerElement.appendChild(renderer.domElement);

		const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
		scene.add(light);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableZoom = true;

		window.addEventListener('resize', onWindowResize, false);

		animate();
	}

	function loadModel() {
		const loader = new GLTFLoader();
		loader.load(material.link, (gltf) => {
			model = gltf.scene;
			model.scale.set(1, 1, 1); // Adjust scale as needed
			scene.add(model);

			// Center the model
			const box = new THREE.Box3().setFromObject(model);
			const center = box.getCenter(new THREE.Vector3());
			model.position.sub(center);
		});
	}

	function checkARSupport() {
		if ('xr' in navigator) {
			navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
				isARSupported = supported;
				startARButton.style.display = supported ? 'block' : 'none';
			});
		}
	}

	function startAR() {
		if (isARSupported && !renderer.xr.isPresenting) {
			navigator
				.xr!.requestSession('immersive-ar', {
					requiredFeatures: ['hit-test']
				})
				.then(onSessionStarted);
		}
	}

	function onSessionStarted(session: XRSession) {
		renderer.xr.enabled = true;
		renderer.xr.setReferenceSpaceType('local');
		renderer.xr.setSession(session);

		session.addEventListener('end', onSessionEnded);
		session.addEventListener('select', onSelect);

		startARButton.style.display = 'none';

		// Set up the WebXR animation loop
		session.requestAnimationFrame(render);
	}

	function onSessionEnded() {
		renderer.xr.enabled = false;
		startARButton.style.display = 'block';

		// Resume the non-AR animation loop
		animate();
	}

	function onSelect() {
		if (model && renderer.xr.isPresenting) {
			const controller = renderer.xr.getController(0);
			model.position.setFromMatrixPosition(controller.matrixWorld);
			model.quaternion.setFromRotationMatrix(controller.matrixWorld);
		}
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {
		if (!renderer.xr.isPresenting) {
			requestAnimationFrame(animate);
			controls.update();
			renderer.render(scene, camera);
		}
	}

	function render() {
		if (renderer.xr.isPresenting) {
			renderer.render(scene, camera);
		}
	}
</script>

<div bind:this={containerElement}></div>
<button class="bg-green-500" bind:this={startARButton} on:click={startAR}>Start AR</button>

<style>
	div {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 80%;
	}
	button {
		position: absolute;
		bottom: 20px;
		left: 50%;
		transform: translateX(-50%);
		padding: 10px 20px;
		font-size: 16px;
		color: white;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		display: none; /* Hidden by default, shown if AR is supported */
	}
</style>
