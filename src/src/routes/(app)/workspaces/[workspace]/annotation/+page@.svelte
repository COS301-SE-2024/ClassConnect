<script lang="ts">
	import { onMount } from 'svelte';
	import * as THREE from 'three';
	import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

	interface Annotation {
		id: number;
		title: string;
		description: string;
		x: number;
		y: number;
		z: number;
	}

	let annotations: Annotation[] = [
		// We'll start with an empty array as we don't know the model's dimensions yet
	];

	let canvas: HTMLCanvasElement;
	let numberCanvases: HTMLCanvasElement[] = [];
	let annotationDivs: HTMLDivElement[] = [];

	let camera: THREE.PerspectiveCamera;
	let controls: OrbitControls;
	let scene: THREE.Scene;
	let renderer: THREE.WebGLRenderer;
	let sprites: THREE.Sprite[] = [];
	let model: THREE.Object3D;
	let spriteBehindObject: boolean[] = [];

	let raycaster: THREE.Raycaster;
	let mouse: THREE.Vector2;

	onMount(() => {
		initThree();
		loadModel();
		initNumbers();
		animate();

		raycaster = new THREE.Raycaster();
		mouse = new THREE.Vector2();

		canvas.addEventListener('click', onCanvasClick);

		return () => {
			renderer.dispose();
			controls.dispose();
			canvas.removeEventListener('click', onCanvasClick);
		};
	});

	function initThree() {
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(5, 5, 5);

		renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x333333);

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
		directionalLight.position.set(1, 1, 1);
		scene.add(directionalLight);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.dampingFactor = 0.25;
		controls.screenSpacePanning = false;
		controls.maxPolarAngle = Math.PI / 2;

		window.addEventListener('resize', onWindowResize);
	}

	function loadModel() {
		const loader = new GLTFLoader();
		loader.load(
			'https://class-connect-file-storage.s3.amazonaws.com/objects/66ea98db765ee296b456a7f5.glb',
			(gltf) => {
				model = gltf.scene;
				scene.add(model);

				// Center the model
				const box = new THREE.Box3().setFromObject(model);
				const center = box.getCenter(new THREE.Vector3());
				model.position.sub(center);

				// Adjust camera position based on model size
				const size = box.getSize(new THREE.Vector3());
				const maxDim = Math.max(size.x, size.y, size.z);
				const fov = camera.fov * (Math.PI / 180);
				let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
				cameraZ *= 1.5; // Zoom out a little so object fits in view
				camera.position.set(cameraZ, cameraZ, cameraZ);
				camera.updateProjectionMatrix();

				// Update controls
				controls.target.set(0, 0, 0);
				controls.update();
			},
			undefined,
			(error) => {
				console.error('An error happened', error);
			}
		);
	}

	function initNumbers() {
		annotations.forEach((annotation, index) => {
			const ctx = numberCanvases[index].getContext('2d');
			if (!ctx) return;

			const x = 32;
			const y = 32;
			const radius = 30;
			const startAngle = 0;
			const endAngle = Math.PI * 2;

			ctx.fillStyle = 'rgb(0, 0, 0)';
			ctx.beginPath();
			ctx.arc(x, y, radius, startAngle, endAngle);
			ctx.fill();

			ctx.strokeStyle = 'rgb(255, 255, 255)';
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(x, y, radius, startAngle, endAngle);
			ctx.stroke();

			ctx.fillStyle = 'rgb(255, 255, 255)';
			ctx.font = '32px sans-serif';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText(annotation.id.toString(), x, y);
		});
	}

	function onWindowResize() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}

	function animate() {
		requestAnimationFrame(animate);
		controls.update();
		render();
	}

	function render() {
		renderer.render(scene, camera);
		updateAnnotationOpacities();
		updateScreenPositions();
	}

	function updateAnnotationOpacities() {
		sprites.forEach((sprite, index) => {
			const meshDistance = camera.position.distanceTo(new THREE.Vector3());
			const spriteDistance = camera.position.distanceTo(sprite.position);
			spriteBehindObject[index] = spriteDistance > meshDistance;
			sprite.material.opacity = spriteBehindObject[index] ? 0.25 : 1;
		});
	}

	function updateScreenPositions() {
		annotations.forEach((annotation, index) => {
			const vector = new THREE.Vector3(annotation.x, annotation.y, annotation.z);
			const canvas = renderer.domElement;

			vector.project(camera);

			vector.x = Math.round((0.5 + vector.x / 2) * (canvas.width / window.devicePixelRatio));
			vector.y = Math.round((0.5 - vector.y / 2) * (canvas.height / window.devicePixelRatio));

			annotationDivs[index].style.top = `${vector.y}px`;
			annotationDivs[index].style.left = `${vector.x}px`;
			annotationDivs[index].style.opacity = spriteBehindObject[index] ? '0.1' : '1';
		});
	}

	function onCanvasClick(event: MouseEvent) {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

		raycaster.setFromCamera(mouse, camera);

		if (model) {
			const intersects = raycaster.intersectObject(model, true);

			if (intersects.length > 0) {
				const point = intersects[0].point;
				console.log('Clicked point:', point);
				addNewAnnotation(point);
			}
		}
	}

	function addNewAnnotation(point: THREE.Vector3) {
		const newId = annotations.length + 1;
		const newAnnotation: Annotation = {
			id: newId,
			title: `Annotation ${newId}`,
			description: 'New annotation description',
			x: point.x,
			y: point.y,
			z: point.z
		};

		annotations.push(newAnnotation);
		annotations = annotations; // Trigger Svelte reactivity

		const newNumberCanvas = document.createElement('canvas');
		newNumberCanvas.width = 64;
		newNumberCanvas.height = 64;
		numberCanvases.push(newNumberCanvas);
		numberCanvases = numberCanvases; // Trigger Svelte reactivity

		const numberTexture = new THREE.CanvasTexture(newNumberCanvas);
		const spriteMaterial = new THREE.SpriteMaterial({
			map: numberTexture,
			alphaTest: 0.5,
			transparent: true,
			depthTest: false,
			depthWrite: false
		});
		const sprite = new THREE.Sprite(spriteMaterial);
		sprite.position.set(point.x, point.y, point.z);
		sprite.scale.set(0.1, 0.1, 0.1); // Adjusted scale for the new model
		scene.add(sprite);
		sprites.push(sprite);

		initNumbers();
		render();
	}
</script>

<div class="relative h-[50%] w-[50%]">
	<canvas bind:this={canvas} class=""></canvas>

	{#each annotations as annotation, i}
		<div
			bind:this={annotationDivs[i]}
			class="absolute z-10 w-48 rounded-lg bg-black bg-opacity-80 p-4 text-xs leading-tight text-white transition-opacity duration-500 before:content-['{annotation.id}'] before:absolute before:-left-8 before:-top-8 before:h-8 before:w-8 before:rounded-full before:border-2 before:border-white before:bg-black before:bg-opacity-80 before:text-center before:text-base before:leading-8"
		>
			<p class="mb-2 font-bold">{annotation.title}</p>
			<p>{annotation.description}</p>
		</div>
		<canvas bind:this={numberCanvases[i]} width="64" height="64" class="absolute -z-10"></canvas>
	{/each}
</div>
