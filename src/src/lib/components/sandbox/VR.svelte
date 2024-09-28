<script lang="ts">
	import { GLTF } from '@threlte/extras';
	import { T, useFrame } from '@threlte/core';
	import { Vector3, Quaternion, Euler } from 'three';
	import type { XRControllerEvent } from '@threlte/xr';
	import { pointerControls, Controller } from '@threlte/xr';

	export let currentModel: string;

	let ref: any;
	let isPointing = false;
	let isSqueezed = false;
	let offset = new Vector3();
	let isTriggerPressed = false;
	let activeController: any = null;
	let squeezedController: any = null;
	let originalRotation = new Euler();
	let originalScale = new Vector3(1, 1, 1);
	let initialObjectPosition = new Vector3();
	let controllerQuaternion = new Quaternion();
	let initialControllerPosition = new Vector3();

	$: if (ref) {
		originalScale.copy(ref.scale);
		originalRotation.copy(ref.rotation);
	}

	export const handlePointerEnter = () => {
		isPointing = true;
		if (ref) ref.scale.multiplyScalar(1.1);
	};

	export const handlePointerLeave = () => {
		isPointing = false;
		if (ref) ref.scale.copy(originalScale);
	};

	const handleTriggerStart = (event: XRControllerEvent) => {
		isSqueezed = true;
		squeezedController = event.target;

		if (ref) {
			squeezedController.getWorldPosition(initialControllerPosition);
			ref.getWorldPosition(initialObjectPosition);
			offset.copy(initialObjectPosition).sub(initialControllerPosition);
		}
	};

	const handleTriggerEnd = () => {
		isSqueezed = false;
		squeezedController = null;
	};

	const handleSqueezeStart = (event: XRControllerEvent) => {
		isTriggerPressed = true;
		activeController = event.target;
		if (ref) controllerQuaternion.copy(activeController.quaternion);
	};

	const handleSqueezeEnd = () => {
		isTriggerPressed = false;
		activeController = null;
	};

	useFrame(() => {
		if (isTriggerPressed && ref && activeController) {
			const currentControllerQuaternion = activeController.quaternion;

			const rotationDiff = new Quaternion().multiplyQuaternions(
				controllerQuaternion.clone().invert(),
				currentControllerQuaternion
			);

			ref.quaternion.premultiply(rotationDiff);
			controllerQuaternion.copy(currentControllerQuaternion);
		}

		if (isSqueezed && ref && squeezedController) {
			const currentControllerPosition = new Vector3();
			squeezedController.getWorldPosition(currentControllerPosition);

			const newObjectPosition = new Vector3().copy(currentControllerPosition).add(offset);
			ref.position.copy(newObjectPosition);
		}
	});

	pointerControls('left');
	pointerControls('right');
</script>

<Controller
	left
	on:selectstart={handleTriggerStart}
	on:selectend={handleTriggerEnd}
	on:squeezestart={handleSqueezeStart}
	on:squeezeend={handleSqueezeEnd}
/>

<Controller
	right
	on:selectstart={handleTriggerStart}
	on:selectend={handleTriggerEnd}
	on:squeezestart={handleSqueezeStart}
	on:squeezeend={handleSqueezeEnd}
/>

<T.Mesh
	bind:ref
	position={[0, 1, -1]}
	on:pointerenter={handlePointerEnter}
	on:pointerleave={handlePointerLeave}
>
	<GLTF url={currentModel} />
</T.Mesh>
