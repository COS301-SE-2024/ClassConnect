<script lang="ts">
	import { T, useThrelte, useTask } from '@threlte/core';
	import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
	import { PerspectiveCamera, Vector3 } from 'three';
	import * as THREE from 'three';
	import { onDestroy, onMount } from 'svelte';
	import { CollisionGroups, Collider, RigidBody } from '@threlte/rapier';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';

	const t = new Vector3();
	let controls: PointerLockControls;
	export let position: [x: number, y: number, z: number] = [0, 0, 40];

	let highlightedMesh: THREE.Mesh | null = null;
	let originalMaterial: THREE.Material | THREE.Material[] | null = null;
	let outlineMesh: THREE.Mesh | null = null; // Track the outline mesh

	let isLightOn = false; // Tracks the state of the light
	let lightToggleInProgress = false; // Prevents multiple tog

	let radius = 0.3;
	let height = 1.8;
	let speed: number = 6;

	let forward = 0;
	let backward = 0;
	let left = 0;
	let right = 0;

	let rigidBody: RapierRigidBody;
	let pointLight: THREE.PointLight;
	let lightOn = false;

	const { renderer, scene } = useThrelte();
	const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();

	function onMouseMove(event: MouseEvent) {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	}

	function onKeyDown(e: KeyboardEvent) {
		if (!controls.isLocked) return;
		switch (e.key) {
			case 's':
				backward = 2;
				break;
			case 'w':
				forward = 2;
				break;
			case 'a':
				left = 2;
				break;
			case 'd':
				right = 2;
				break;
			case 'e':
				highlightObject();
				break; // Add highlight on pressing 'E'
			case 'q':
				unhighlightObject();
				break; // Unhighlight on pressing 'Q'
			case 'l':
				toggleLight();
				break; // Toggle light on/off with 'L'
			default:
				break;
		}
	}

	function onKeyUp(e: KeyboardEvent) {
		switch (e.key) {
			case 's':
				backward = 0;
				break;
			case 'w':
				forward = 0;
				break;
			case 'a':
				left = 0;
				break;
			case 'd':
				right = 0;
				break;
			default:
				break;
		}
	}

	onMount(() => {
		controls = new PointerLockControls(cam, renderer.domElement);
		renderer.domElement.addEventListener('click', () => {
			controls.lock();
		});
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);
		window.addEventListener('mousemove', onMouseMove);

		// Initialize the point light
		pointLight = new THREE.PointLight(0xffffff, 10, 10);
		pointLight.visible = lightOn;
		scene.add(pointLight);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
		window.removeEventListener('mousemove', onMouseMove);
	});

	function highlightObject() {
		raycaster.setFromCamera(pointer, cam);
		const intersects = raycaster.intersectObjects(scene.children, true);

		// Unhighlight previous object
		unhighlightObject();

		// Highlight the first mesh found
		if (intersects.length > 0) {
			const firstObject = intersects.find((intersect) => intersect.object instanceof THREE.Mesh)
				?.object as THREE.Mesh;
			if (firstObject) {
				highlightedMesh = firstObject;
				originalMaterial = firstObject.material;

				// Create an outline effect by scaling the object
				const outlineGeometry = (firstObject.geometry as THREE.BufferGeometry).clone();
				const outlineMaterial = new THREE.MeshBasicMaterial({
					color: 0xffff00, // yellow outline
					side: THREE.BackSide,
					transparent: true,
					opacity: 0.5
				});
				outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
				outlineMesh.scale.multiplyScalar(1.05); // Scale the outline slightly larger
				firstObject.add(outlineMesh);
			}
		}
	}

	function unhighlightObject() {
		if (highlightedMesh) {
			// Restore original material
			if (originalMaterial) {
				highlightedMesh.material = originalMaterial;
			}
			// Remove the outline mesh
			if (outlineMesh && highlightedMesh) {
				highlightedMesh.remove(outlineMesh);
			}
			highlightedMesh = null;
			outlineMesh = null;
		}
	}

	function toggleLight() {
		if (!lightToggleInProgress) {
			lightToggleInProgress = true; // Prevent multiple toggles
			isLightOn = !isLightOn; // Toggle the light state
			pointLight.visible = isLightOn;
			console.log(`Light ${isLightOn ? 'on' : 'off'}`);

			// Set a small delay to allow the key to be released before it can toggle again
			setTimeout(() => {
				lightToggleInProgress = false;
			}, 300); // 300ms delay (adjust as needed)
		}
	}

	useTask(() => {
		if (controls.isLocked) {
			// Center the raycaster
			pointer.x = 0;
			pointer.y = 0;

			// Update the point light's position to follow the camera
			if (pointLight) {
				pointLight.position.copy(cam.position);
				pointLight.position.add(cam.getWorldDirection(new Vector3()).multiplyScalar(1.5)); // Place it slightly ahead of the player
			}
		}
	});

	let cam: PerspectiveCamera;

	useTask(() => {
		if (!rigidBody) return;
		const velVec = t.fromArray([right - left, 0, backward - forward]);
		velVec.applyEuler(cam.rotation).multiplyScalar(speed);
		const linVel = rigidBody.linvel();
		t.y = linVel.y;
		rigidBody.setLinvel(t, true);

		const pos = rigidBody.translation();
		position = [pos.x, pos.y, pos.z];
	});
</script>

<svelte:window on:keydown|preventDefault={onKeyDown} on:keyup={onKeyUp} />

<T.Group position.y={0.9}>
	<T.PerspectiveCamera
		makeDefault
		fov={90}
		bind:ref={cam}
		position.x={position[0]}
		position.y={position[1]}
		position.z={position[2]}
	/>
</T.Group>

<T.Group {position}>
	<RigidBody bind:rigidBody enabledRotations={[false, false, false]}>
		<CollisionGroups groups={[0]}>
			<Collider shape={'capsule'} args={[height / 2 - radius, radius]} />
		</CollisionGroups>

		<CollisionGroups groups={[15]}>
			<T.Group position={[0, -height / 2 + radius, 0]}>
				<Collider sensor shape={'ball'} args={[radius * 1.2]} />
			</T.Group>
		</CollisionGroups>
	</RigidBody>
</T.Group>
