<script lang="ts">
	import { T } from '@threlte/core';
	import {
		Align,
		Environment,
		Float,
		GLTF,
		HTML,
		OrbitControls,
		Stars,
		Text3DGeometry
	} from '@threlte/extras';
	import { Button, CloseButton, Drawer, Hr, Listgroup, ListgroupItem } from 'flowbite-svelte';
	import { BarsOutline, ArrowLeftToBracketOutline } from 'flowbite-svelte-icons';
	import { Box3, Vector3, type Object3D } from 'three';
	import { sineIn } from 'svelte/easing';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let isClosed = true;
	let transitionParams = { x: -320, duration: 200, easing: sineIn };
	let currentModel = '';
	let text = 'SandBox';
	let bevelEnabled = true;
	let bevelOffset = 0;
	let bevelSegments = 20;
	let bevelSize = 0.2;
	let bevelThickness = 0.1;
	let curveSegments = 12;
	let height = 1;
	let size = 5;
	let smooth = 0.1;

	const models = [
		{ name: 'Violin', url: '/models/violin.glb' },
		{ name: 'Golden Eagle', url: '/models/golden_eagle-v1.glb' },
		{ name: 'Cash Register', url: '/models/cash_register_with_a_counting_machine.glb' }
	];

	function navigateToParentRoute() {
		const segments = $page.url.pathname.split('/').filter(Boolean);
		if (segments.length > 1) {
			segments.pop();
			const newPath = '/' + segments.join('/');
			goto(newPath);
		}
	}

	const normalizeModel = (object: Object3D) => {
		const box = new Box3().setFromObject(object);
		const size = box.getSize(new Vector3());
		const maxDim = Math.max(size.x, size.y, size.z);
		const center = box.getCenter(new Vector3());
		const scale = 1 / maxDim;
		const position = center.multiplyScalar(-1);
		return { scale, position };
	};

	const loadModel = (modelUrl: string) => {
		currentModel = modelUrl;
	};

	const handleModelCreate = ({ ref }: { ref: Object3D }) => {
		const { scale, position } = normalizeModel(ref);
		ref.scale.setScalar(scale);
		ref.position.copy(position);
	};
</script>

{#if !currentModel}
	<Align let:align>
		<Float>
			<T.Mesh>
				<Text3DGeometry
					{text}
					{bevelEnabled}
					{bevelOffset}
					{bevelSegments}
					{bevelSize}
					{bevelThickness}
					{curveSegments}
					{height}
					{size}
					{smooth}
					on:create={align}
				/>
				<T.MeshStandardMaterial
					color="#FD3F00"
					toneMapped={false}
					metalness={1.0}
					roughness={0.1}
				/>
			</T.Mesh>
		</Float>
	</Align>
	<Environment files="/environment/shanghai.hdr" />
	<Stars />
	<Float rotationIntensity={[0, 3, 0]} rotationSpeed={1} floatingRange={[-5, 5]} speed={1}>
		<T.PerspectiveCamera
			makeDefault
			position.y={0}
			position.z={20}
			fov={90}
			on:create={({ ref }) => {
				ref.lookAt(0, 0, 0);
			}}
		>
			<HTML>
				<Button
					on:click={() => (isClosed = false)}
					color="dark"
					class="m-4 rounded-md border border-gray-300 bg-transparent bg-opacity-30 p-1 backdrop-blur-md dark:border-gray-700"
				>
					<BarsOutline size="xl" />
				</Button>
				<Drawer
					transitionType="fly"
					{transitionParams}
					bind:hidden={isClosed}
					id="sidebar1"
					class="flex h-full flex-col bg-transparent bg-opacity-30 backdrop-blur-md"
				>
					<div class="flex">
						<h1 class="text-xl font-bold text-white">Menu</h1>
						<CloseButton on:click={() => (isClosed = true)} class="mb-4 text-white" />
					</div>
					<Listgroup class="bg-transparent bg-opacity-30 backdrop-blur-md">
						<h3 class="p-1 text-center text-xl font-bold text-white">Available Models</h3>
						{#each models as model}
							<ListgroupItem
								class="flex w-full items-center p-2 text-lg text-white transition-colors hover:bg-gray-700"
							>
								<span>{model.name}</span>
								<Button on:click={() => loadModel(model.url)} color="light" class="ml-auto p-2"
									>Load</Button
								>
							</ListgroupItem>
						{/each}
					</Listgroup>

					<Button on:click={navigateToParentRoute} color="dark" class="mt-auto"
						>Exit<ArrowLeftToBracketOutline /></Button
					>
				</Drawer>
			</HTML>
		</T.PerspectiveCamera>
	</Float>
{:else}
	<T.PerspectiveCamera
		makeDefault
		position={[0, 0, 5]}
		fov={25}
		on:create={({ ref }) => {
			ref.lookAt(0, 0, 0);
		}}
	>
		<OrbitControls autoRotate enableDamping />
		<HTML>
			<Button
				on:click={() => (isClosed = false)}
				color="dark"
				class="m-4 rounded-md border border-gray-300 bg-transparent bg-opacity-30 p-1 backdrop-blur-md dark:border-gray-700"
			>
				<BarsOutline size="xl" />
			</Button>
			<Drawer
				transitionType="fly"
				{transitionParams}
				bind:hidden={isClosed}
				id="sidebar1"
				class="flex h-full flex-col bg-transparent bg-opacity-30 backdrop-blur-md"
			>
				<div class="flex">
					<h1 class="text-xl font-bold text-white">Menu</h1>
					<CloseButton on:click={() => (isClosed = true)} class="mb-4 text-white" />
				</div>
				<Listgroup class="bg-transparent bg-opacity-30 backdrop-blur-md">
					<h3 class="p-1 text-center text-xl font-bold text-white">Available Models</h3>
					{#each models as model}
						<ListgroupItem
							class="flex w-full items-center p-2 text-lg text-white transition-colors hover:bg-gray-700"
						>
							<span>{model.name}</span>
							<Button on:click={() => loadModel(model.url)} color="light" class="ml-auto p-2"
								>Load</Button
							>
						</ListgroupItem>
					{/each}
				</Listgroup>

				<Button on:click={navigateToParentRoute} color="dark" class="mt-auto"
					>Exit<ArrowLeftToBracketOutline /></Button
				>
			</Drawer>
		</HTML>
	</T.PerspectiveCamera>
	<T.AmbientLight intensity={1} />
	<GLTF url={currentModel} on:create={handleModelCreate} />
{/if}
