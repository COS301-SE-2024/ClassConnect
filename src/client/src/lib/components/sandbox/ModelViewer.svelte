<script lang="ts">
	import { T } from '@threlte/core';
	import { Box3, Vector3 } from 'three';
	import { GLTF, OrbitControls, Sky } from '@threlte/extras';
	import { Checkbox, Pane, ThemeUtils, Slider } from 'svelte-tweakpane-ui';

	import type { Object3D } from 'three';

	import VR from '$lib/components/sandbox/VR.svelte';
	import Menu from '$lib/components/sandbox/Menu.svelte';

	export let currentModel: string;

	let zoomSpeed: number = 1;
	let rotateSpeed: number = 1;
	let enableZoom: boolean = true;
	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let zoomToCursor: boolean = false;

	const normalizeModel = (object: Object3D) => {
		const box = new Box3().setFromObject(object);

		const size = box.getSize(new Vector3());
		const center = box.getCenter(new Vector3());

		const maxDim = Math.max(size.x, size.y, size.z);

		const scale = 1 / maxDim;
		const position = center.multiplyScalar(-1);

		return { scale, position };
	};

	const handleModelCreate = ({ ref }: { ref: Object3D }) => {
		const { scale, position } = normalizeModel(ref);

		ref.scale.setScalar(scale);
		ref.position.copy(position);
	};
</script>

<VR />

<T.PerspectiveCamera
	fov={25}
	makeDefault
	position={[0, 0, 5]}
	on:create={({ ref }) => ref.lookAt(0, 0, 0)}
>
	<Menu />

	<OrbitControls
		{zoomSpeed}
		{rotateSpeed}
		{autoRotate}
		{enableZoom}
		{zoomToCursor}
		{enableDamping}
	/>
</T.PerspectiveCamera>

<Sky />

<T.AmbientLight intensity={1} />

<GLTF url={currentModel} on:create={handleModelCreate} />

<Pane position="fixed" theme={ThemeUtils.presets.light} title="Object Settings">
	<Checkbox bind:value={autoRotate} label="autoRotate" />
	<Checkbox bind:value={enableZoom} label="enableZoom" />
	<Checkbox bind:value={zoomToCursor} label="zoomToCursor" />
	<Checkbox bind:value={enableDamping} label="enableDamping" />
	
	<Slider label="zoomSpeed" bind:value={zoomSpeed} min={0.1} max={4} step={0.1} />
	<Slider label="rotateSpeed" bind:value={rotateSpeed} min={0.1} max={8} step={0.1} />
</Pane>
