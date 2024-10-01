<script lang="ts">
	import { T, useThrelte, useLoader } from '@threlte/core';
	import { useGltf } from '@threlte/extras';
	import Player from './Player.svelte';
	import Floor from './Floor.svelte';
	import { AutoColliders, RigidBody } from '@threlte/rapier';
	import { Text, Pane } from 'svelte-tweakpane-ui';
	import * as THREE from 'three';
	const { scene } = useThrelte();

	const shovel = useGltf('/environment/models/shovel.glb');
	const pick = useGltf('/environment/models/low_poly_pickaxe.glb');
	const wall = useLoader(THREE.TextureLoader).load('/environment/textures/Rock032_4K_Color.jpg');

	scene.background = new THREE.TextureLoader().load('/environment/textures/Rock032_4K_Color.jpg');
	scene.backgroundIntensity = 0.02;
</script>

<Pane position="fixed" title="3D Environment Controls" x={1300} y={80}>
	<Text value="Use the 'WASD' keys to move around" disabled />
	<Text value="Press escape 'Esc' to exit the scene" disabled />
	<Text value="Use the mouse to look around" disabled />
	<Text value="Press 'E' to interact with objects" disabled />
	<Text value="Press 'L' to toggle the Torch" disabled />
</Pane>

<Pane position="fixed" title="Controller Controls" x={1300} y={240}>
	<Text value="Use the Left Stick to move around" disabled />
	<Text value="Use the Right Stick to look around" disabled />
	<Text value="Press 'A' to jump" disabled />
	<Text value="Press 'X' to interact with objects" disabled />
	<Text value="Press 'LB' to toggle the Torch" disabled />
	<Text value="Press 'RB' to exit stage" disabled />
</Pane>

<Pane position="fixed" title="3D Environment Controls" x={1300} y={430}>
	<Text value="Press 'O' to exit stage" disabled />
</Pane>

<Player />

<T.AmbientLight intensity={0.06} />

<T.Group scale={1}>
	{#await shovel}
		<slot name="fallback" />
	{:then shovel}
		<RigidBody type="dynamic">
			<AutoColliders shape={'trimesh'}>
				<T is={shovel.scenes[0]} scale={0.012} position={[-5, 10, 40]} />
			</AutoColliders>
		</RigidBody>
	{:catch error}
		<slot name="error" {error} />
	{/await}
</T.Group>

<T.Group scale={1}>
	{#await pick}
		<slot name="fallback" />
	{:then pick}
		<RigidBody type="dynamic">
			<AutoColliders shape={'trimesh'}>
				<T is={pick.scenes[0]} scale={1} position={[-20, 3, 27]} />
			</AutoColliders>
		</RigidBody>
	{:catch error}
		<slot name="error" {error} />
	{/await}
</T.Group>

<T.Group position={[10, 25, 26]}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[1, 100, 50]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value} />
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[-10, 45, 24]}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[1, 100, 50]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value} />
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[0, 25, 45]}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[20, 55, 1]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value} />
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[0, 35, 10]} rotation.y={Math.PI / 3}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[20, 74, 1]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value}></T.MeshStandardMaterial>
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[0, 35, -10]}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[50, 74, 1]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value}></T.MeshStandardMaterial>
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[30, 35, -10]} rotation.y={Math.PI / 3}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[50, 74, 1]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value}></T.MeshStandardMaterial>
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[-30, 35, -10]} rotation.y={-Math.PI / 4}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[50, 74, 1]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value}></T.MeshStandardMaterial>
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[0, 35, -50]}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[100, 74, 0.5]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value}></T.MeshStandardMaterial>
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[0, 35, -50]}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[100, 74, 0.5]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value}></T.MeshStandardMaterial>
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[0, 35, 50]}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[100, 74, 0.5]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value}></T.MeshStandardMaterial>
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[-50, 35, 0]} rotation.y={Math.PI / 2}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[100, 74, 0.5]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value}></T.MeshStandardMaterial>
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<T.Group position={[50, 35, 0]} rotation.y={Math.PI / 2}>
	<RigidBody type="fixed">
		<AutoColliders shape={'cuboid'}>
			<T.Mesh receiveShadow>
				<T.BoxGeometry args={[100, 74, 0.5]} />
				{#await wall then value}
					<T.MeshStandardMaterial map={value}></T.MeshStandardMaterial>
				{/await}
			</T.Mesh>
		</AutoColliders>
	</RigidBody>
</T.Group>

<Floor />
