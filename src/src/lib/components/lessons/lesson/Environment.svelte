<script lang="ts">
	import { Canvas, T } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
	import { Select } from 'flowbite-svelte';

	let selectedModel = '';
	let models = [
		{ name: 'Model 1', value: 'Model1', label: 'Model 1' },
		{ name: 'Model 2', value: 'Model2', label: 'Model 2' },
		{ name: 'Model 3', value: 'Model3', label: 'Model 3' }
	];
	let modelUrl = '';

	$: {
		if (selectedModel) {
			modelUrl = `/models/${selectedModel}.glb`; // Adjust path as needed
		}
	}
</script>

<div class="h-screen w-full bg-gray-100">
	<div class="p-4">
		<Select
			class="mb-4"
			items={models}
			bind:value={selectedModel}
			placeholder="Select a 3D model"
		/>
	</div>

	<Canvas>
		<T.PerspectiveCamera makeDefault position={[5, 5, 5]} />
		<OrbitControls enableDamping />

		<T.DirectionalLight intensity={1} position={[3, 10, 10]} />
		<T.AmbientLight intensity={0.5} />

		{#if modelUrl}
			<T.Group>
				<T is={GLTFLoader} url={modelUrl} />
			</T.Group>
		{/if}

		<T.Mesh receiveShadow rotation.x={-Math.PI / 2}>
			<T.PlaneGeometry args={[1000, 1000]} />
			<T.MeshStandardMaterial color="#f0f0f0" />
		</T.Mesh>
	</Canvas>
</div>
