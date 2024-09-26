<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import {P} from 'flowbite-svelte';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
	import { TransformControls } from 'three/addons/controls/TransformControls.js';
	import Menu from './3dMenu.svelte';
	import { selectedModel } from '$lib/store/model';
	
	import { spherePosition } from '$lib/store/position';

	export let data: {
		role: string;
		models: { title: string; file_path: string; description: string }[];
	};

	let { models } = data;
	let storedModel: string | null = null;
	$: storedModel = $selectedModel;
	

	let savedSpherePosition: THREE.Vector3;
	$: savedSpherePosition = $spherePosition;
	let canvas: HTMLCanvasElement;
	let camera: THREE.PerspectiveCamera, scene: THREE.Scene, renderer: THREE.WebGLRenderer;
	let controls: OrbitControls;
	let dragControls: DragControls;
	let draggableSphere: THREE.Mesh;
	let transformControls: TransformControls;
	
	let pinPos: THREE.Vector3 = new THREE.Vector3();
	let currentModel: THREE.Object3D | null = null;

	onMount(() => {
		initScene();
		animate();
		
	});

	$: if (storedModel) {
		loadModel(storedModel);
	}

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
				color: 0xb604f6,
				transparent: false,
				opacity: 1
			});
			draggableSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
			draggableSphere.position.set(1, 1, 0);
			scene.add(draggableSphere);

			// Initialize TransformControls for the sphere
			transformControls = new TransformControls(camera, renderer.domElement);
			transformControls.attach(draggableSphere);
			transformControls.setMode('translate');
			scene.add(transformControls);

			//sphere transform
			transformControls.addEventListener('mouseDown', () => {
				controls.enabled = false; 
			});
			transformControls.addEventListener('mouseUp', () => {
				controls.enabled = true;
				$spherePosition.copy(draggableSphere.position);
			});
		} else if (data.role === 'student') {
			// Create and add the new pin
			const pinGeometry = new THREE.SphereGeometry(0.05);
			const pinMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
			const pin = new THREE.Mesh(pinGeometry, pinMaterial);

			pin.position.set(0, 1, 0);
			scene.add(pin);

			transformControls = new TransformControls(camera, renderer.domElement);
			transformControls.attach(pin);
			transformControls.setMode('translate');
			scene.add(transformControls);

			//sphere transform
			transformControls.addEventListener('mouseDown', () => {
				controls.enabled = false; 
			});
			transformControls.addEventListener('mouseUp', () => {
				controls.enabled = true;
				$spherePosition.copy(pin.position);
			});
		}

		// Initialize OrbitControls
		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.enableRotate = true;
		controls.autoRotate = false;
		controls.autoRotateSpeed = 2.0;

		

		window.addEventListener('resize', onWindowResize, false);
	}

	function loadModel(file_path: string) {
		
		const loader = new GLTFLoader();
		loader.load(file_path, (gltf) => {
		  if(currentModel){
			  scene.remove(currentModel);
		  }
		  currentModel=gltf.scene;
		  scene.add(currentModel);
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
		const distance = pin.position.distanceTo(savedSpherePosition);
		const isCorrect = distance <= 0.2;
		return isCorrect;
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function handleModelSelection(file_path: string) {
		selectedModel.set(file_path);
		loadModel(file_path);
	}
</script>

<div class="scene-wrapper">
	{#if data.role === 'lecturer'}
	<div class="flex items-center space-x-4">
		<Menu {models} onModelSelect={handleModelSelection} />
		<P class=" font-semibold text-violet-700">
			Note: Use the transform controls on the violet sphere to drag it to your desired point.
		</P>
	</div>
	{/if}
	<canvas bind:this={canvas}></canvas>
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

	
</style>
