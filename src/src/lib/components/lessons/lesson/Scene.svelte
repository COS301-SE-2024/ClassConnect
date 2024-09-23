<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { OrbitControls, Sky } from '@threlte/extras';
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

	export let selectedObjectUrl = '';
	export let lecturerCameraPosition = { x: 0, y: 5, z: 10 };

	let scene: THREE.Scene;
	let camera;
	let selectedObject;

	onMount(() => {
		// Initialize scene and camera
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(
			lecturerCameraPosition.x,
			lecturerCameraPosition.y,
			lecturerCameraPosition.z
		);

		// Load selected object
		if (selectedObjectUrl) {
			const loader = new GLTFLoader();
			loader.load(selectedObjectUrl, (gltf) => {
				selectedObject = gltf.scene;
				scene.add(selectedObject);
			});
		}

		// Add lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
		directionalLight.position.set(5, 5, 5);
		scene.add(directionalLight);
	});

	function updateLecturerCamera(event: { target: { position: { x: any; y: any; z: any } } }) {
		lecturerCameraPosition = {
			x: event.target.position.x,
			y: event.target.position.y,
			z: event.target.position.z
		};
		// Here you would typically sync this position with other participants
	}
</script>

<Canvas>
	<T.PerspectiveCamera
		makeDefault
		position={[lecturerCameraPosition.x, lecturerCameraPosition.y, lecturerCameraPosition.z]}
		on:update={updateLecturerCamera}
	/>

	<OrbitControls enableDamping />

	<T.Scene bind:ref={scene}>
		<Sky />

		<T.AmbientLight intensity={0.5} />
		<T.DirectionalLight intensity={0.8} position={[5, 5, 5]} castShadow />

		{#if selectedObjectUrl}
			<T is={GLTFLoader} url={selectedObjectUrl} />
		{/if}

		<T.Mesh receiveShadow rotation.x={-Math.PI / 2}>
			<T.PlaneGeometry args={[1000, 1000]} />
			<T.MeshStandardMaterial color="#f0f0f0" />
		</T.Mesh>
	</T.Scene>
</Canvas>
