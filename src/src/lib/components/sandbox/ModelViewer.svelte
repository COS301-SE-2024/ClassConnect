<script lang="ts">
	import { T } from '@threlte/core';
	import { Box3, Vector3 } from 'three';
	import { writable } from 'svelte/store';
	import { Checkbox, Pane, ThemeUtils, Slider, List } from 'svelte-tweakpane-ui';
	import { GLTF, OrbitControls, Sky, TransformControls, useGltfAnimations } from '@threlte/extras';

	import type { Object3D } from 'three';

	import VR from '$lib/components/sandbox/VR.svelte';
	import Menu from '$lib/components/sandbox/Menu.svelte';

	export let currentModel: string;

	let model: any;
	let loaded = false;
	let zoomSpeed: number = 1;
	let selectedAnimation = '';
	let rotateSpeed: number = 1;
	let enableZoom: boolean = true;
	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let zoomToCursor: boolean = false;
	let showTransformControls: boolean = true;

	const animationNames = writable<string[]>([]);
	const { gltf, actions } = useGltfAnimations();

	const normalizeModel = (object: Object3D) => {
		const box = new Box3().setFromObject(object);
		const size = box.getSize(new Vector3());

		const center = box.getCenter(new Vector3());
		const maxDim = Math.max(size.x, size.y, size.z);

		const scale = 1 / maxDim;
		const position = center.multiplyScalar(-1);

		return { scale, position };
	};

	function handleModelCreate({ ref }: { ref: Object3D }) {
		model = ref;

		if (!loaded) {
			const { scale, position } = normalizeModel(ref);

			ref.scale.setScalar(scale);
			ref.position.copy(position);
			loaded = true;
		}
	}

	function playAnimation(name: string) {
		Object.values($actions).forEach((action) => {
			action?.stop();
		});

		if ($actions[name]) {
			$actions[name].reset().play();
		}
	}

	$: {
		if ($actions) {
			animationNames.set(Object.keys($actions));
		}
	}
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

{#if showTransformControls}
	<GLTF bind:gltf={$gltf} url={currentModel} on:create={handleModelCreate} />

	{#if model}
		<TransformControls bind:object={model} />
	{/if}
{:else}
	<GLTF bind:gltf={$gltf} url={currentModel} on:create={handleModelCreate} />
{/if}

<Pane position="fixed" theme={ThemeUtils.presets.light} title="Object Settings">
	<Checkbox bind:value={autoRotate} label="autoRotate" />
	<Checkbox bind:value={enableZoom} label="enableZoom" />
	<Checkbox bind:value={zoomToCursor} label="zoomToCursor" />
	<Checkbox bind:value={enableDamping} label="enableDamping" />
	<Checkbox bind:value={showTransformControls} label="Show Transform Controls" />

	<Slider label="zoomSpeed" bind:value={zoomSpeed} min={0.1} max={4} step={0.1} />
	<Slider label="rotateSpeed" bind:value={rotateSpeed} min={0.1} max={8} step={0.1} />

	{#if $animationNames.length > 0}
		<List
			label="Animations"
			options={$animationNames}
			bind:value={selectedAnimation}
			on:change={() => playAnimation(selectedAnimation)}
		/>
	{/if}
</Pane>
