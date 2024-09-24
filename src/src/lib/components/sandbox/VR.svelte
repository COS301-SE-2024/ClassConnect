<script lang="ts">
	import * as THREE from 'three';
	import type { Object3D } from 'three';
	import { useThrelte, useFrame } from '@threlte/core';
	import { XR, Controller, useController } from '@threlte/xr';

	export let model: Object3D;

	const { scene } = useThrelte();

	const leftController = useController('left');
	const rightController = useController('right');

	const controllers = {
		left: null,
		right: null
	};

	const raycaster = new THREE.Raycaster();
	const tempMatrix = new THREE.Matrix4();

	let grabbedObject: Object3D | null = null;

	function getIntersections(controller) {
		tempMatrix.identity().extractRotation(controller.matrixWorld);

		raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
		raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

		return raycaster.intersectObject(model, true);
	}

	function onSelectStart(event, hand) {
		controllers[hand] = event.target;
		controllers[hand].userData.isSelecting = true;
	}

	function onSelectEnd(event, hand) {
		controllers[hand].userData.isSelecting = false;
		if (grabbedObject && grabbedObject.parent === controllers[hand]) {
			scene.add(grabbedObject);
			grabbedObject = null;
		}
	}

	useFrame(() => {
		['left', 'right'].forEach((hand) => {
			const controller = controllers[hand];
			if (controller && controller.userData.isSelecting) {
				if (!grabbedObject) {
					const intersections = getIntersections(controller);
					if (intersections.length > 0) {
						const intersection = intersections[0];
						const object = intersection.object;
						if (object === model) {
							grabbedObject = object;
							controller.add(grabbedObject);
						}
					}
				}
			}
		});
	});
</script>

<XR>
	<Controller
		left
		on:selectstart={(e) => onSelectStart(e, 'left')}
		on:selectend={(e) => onSelectEnd(e, 'left')}
	/>
	<Controller
		right
		on:selectstart={(e) => onSelectStart(e, 'right')}
		on:selectend={(e) => onSelectEnd(e, 'right')}
	/>

	<!-- Render scene content within XR -->
	<slot />
</XR>
