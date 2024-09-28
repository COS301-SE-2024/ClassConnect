<script lang="ts">
	import { T, useThrelte, useTask } from '@threlte/core';
	import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';
	import { PerspectiveCamera, Vector3 } from 'three';
	import * as THREE from 'three';
	import { onDestroy, onMount } from 'svelte';
	import { CollisionGroups, Collider, RigidBody } from '@threlte/rapier';
	import type { RigidBody as RapierRigidBody } from '@dimforge/rapier3d-compat';
	import {getContext} from 'svelte'

	const t = new Vector3();
	let controls: PointerLockControls;
	export let position: [x: number, y: number, z: number] = [0, 0, 40];

	let highlightedObjects: { mesh: THREE.Mesh; originalMaterial: THREE.Material | THREE.Material[]; outlineMesh: THREE.Mesh }[] = [];

	let isLightOn = false;
	let lightToggleInProgress = false; 

	let radius = 0.3;
	let height = 1.8;
	let speed: number = 6;

	let forward = 0;
	let backward = 0;
	let left = 0;
	let right = 0;

	let selectStage = getContext('selectStage') as () => void;
	let stagePicked = getContext('stagePicked') as boolean;

	let rigidBody: RapierRigidBody;
	let torchLight: THREE.SpotLight;
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
				break;
			case 'q':
				unhighlightObject();
				break;
			case 'l':
				toggleLight();
				break;
			case 'o':
				selectStage();
				break;
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

		// Initializing the Torch
		torchLight = new THREE.SpotLight(0xffffff, 60, 0, Math.PI / 8, 0.2);
		torchLight.visible = lightOn;
		torchLight.castShadow = true; 
		scene.add(torchLight);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', onKeyDown);
		window.removeEventListener('keyup', onKeyUp);
		window.removeEventListener('mousemove', onMouseMove);

	 // Removing the Torch from the Scene
	if (torchLight) {
		scene.remove(torchLight);
		torchLight.dispose();
	}

	// Unhighlight the object if one is currently highlighted
	unhighlightObject();

	});

	function highlightObject() {
		raycaster.setFromCamera(pointer, cam);
		const intersects = raycaster.intersectObjects(scene.children, true);

		if (intersects.length > 0) {
			const firstObject = intersects.find((intersect) => intersect.object instanceof THREE.Mesh)?.object as THREE.Mesh;

			// Ensure the object doesn't have BoxGeometry and hasn't been highlighted already
			if (firstObject && !(firstObject.geometry instanceof THREE.BoxGeometry) && !highlightedObjects.find((h) => h.mesh === firstObject)) {
				const originalMaterial = firstObject.material;

				// Create outline geometry
				const outlineGeometry = (firstObject.geometry as THREE.BufferGeometry).clone();
				const outlineMaterial = new THREE.MeshBasicMaterial({
					color: 0xffff00,
					side: THREE.BackSide,
					transparent: true,
					opacity: 0.5
				});
				const outlineMesh = new THREE.Mesh(outlineGeometry, outlineMaterial);
				outlineMesh.scale.multiplyScalar(1.05);
				firstObject.add(outlineMesh);

				// Store the highlighted object
				highlightedObjects.push({
					mesh: firstObject,
					originalMaterial,
					outlineMesh
				});
			}
		}
}

	function unhighlightObject() {
		for (const { mesh, originalMaterial, outlineMesh } of highlightedObjects) {
		if (mesh && outlineMesh) {
			// Restore the original material
			mesh.material = originalMaterial;

			// Remove the outline mesh from the parent mesh
			if (outlineMesh.parent) {
				outlineMesh.parent.remove(outlineMesh);
			}

			// Dispose of the outline mesh's geometry
			if (outlineMesh.geometry) {
				outlineMesh.geometry.dispose();
			}

			// Dispose of the outline mesh's material(s)
			if (Array.isArray(outlineMesh.material)) {
				outlineMesh.material.forEach((material) => {
					if (material) material.dispose();
				});
			} else if (outlineMesh.material) {
				outlineMesh.material.dispose();
			}
		}
	}

	// Clear the highlightedObjects array once all objects are unhighlighted
	highlightedObjects = [];
}

	function toggleLight() {
		if (!lightToggleInProgress) {
			lightToggleInProgress = true;
			isLightOn = !isLightOn;
			torchLight.visible = isLightOn;
			setTimeout(() => {
				lightToggleInProgress = false;
			}, 300);
		}
	}

	useTask(() => {
		if (controls.isLocked) {
			pointer.x = 0;
			pointer.y = 0;


			if (torchLight) {
				const direction = cam.getWorldDirection(new Vector3()).normalize();

// Copy camera position for the spotlight
torchLight.position.copy(cam.position);

// Adjust the spotlight target to be slightly higher
const spotTarget = cam.position.clone().add(direction.multiplyScalar(5));

// Move the target slightly up on the Y-axis to point above the player's view
spotTarget.y += 1.0; // Adjust this value to move it higher

torchLight.target.position.copy(spotTarget);
torchLight.target.updateMatrixWorld();
			}
		}
	});

	let cam: PerspectiveCamera;
// Required for movemnt in Scene
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
