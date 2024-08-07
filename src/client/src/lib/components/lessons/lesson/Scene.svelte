<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { T, useFrame } from '@threlte/core';
	import { OrbitControls, GLTF, Sky } from '@threlte/extras';
	import { insertCoin, isHost, onPlayerJoin, setState, getState } from 'playroomkit';
	import { Vector3, PerspectiveCamera } from 'three';

	let players: any[] = [];
	let camera: PerspectiveCamera;
	let cameraPosition = new Vector3();

	export let selectedObject: string =
		'https://class-connect-file-storage.s3.amazonaws.com/objects/66a0f01ef4736bcf3a73c7d0.glb';

	async function init() {
		await insertCoin({ skipLobby: true, roomCode: $page.params.lesson });
		onPlayerJoin((state) => {
			players.push(state);
			state.onQuit(() => {
				players = players.filter((p) => p !== state);
			});
		});
	}

	onMount(() => {
		init();
	});

	useFrame(() => {
		if (camera) {
			cameraPosition.copy(camera.position);
			if (isHost()) {
				// Host updates camera position and selected object for all players
				setState('cameraPosition', {
					x: cameraPosition.x,
					y: cameraPosition.y,
					z: cameraPosition.z
				});
				setState('selectedObject', selectedObject);
			} else {
				// Non-host players get camera position and selected object from host
				const hostCameraPos = getState('cameraPosition');
				const hostSelectedObject = getState('selectedObject');
				if (hostCameraPos) {
					camera.position.set(hostCameraPos.x, hostCameraPos.y, hostCameraPos.z);
				}
				if (hostSelectedObject) {
					selectedObject = hostSelectedObject;
				}
			}
		}
	});

	const maxZoomOutDistance = 100;

	let autoRotate: boolean = false;
	let enableDamping: boolean = true;
	let rotateSpeed: number = 1;
	let zoomToCursor: boolean = false;
	let zoomSpeed: number = 1;
	let enableZoom: boolean = true;
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, -45]} fov={75}>
	<OrbitControls
		{enableDamping}
		{autoRotate}
		{rotateSpeed}
		{zoomToCursor}
		{zoomSpeed}
		{enableZoom}
		maxDistance={maxZoomOutDistance}
	/>
</T.PerspectiveCamera>

<!-- Add ambient light for base illumination -->
<T.AmbientLight intensity={0.9} />

<!-- Add multiple point lights for even lighting -->
<T.PointLight position={[0, 10, 10]} intensity={0.5} />
<T.PointLight position={[0, -10, 10]} intensity={0.5} />
<T.PointLight position={[10, 10, 0]} intensity={0.5} />
<T.PointLight position={[-10, -10, 0]} intensity={0.5} />
<T.PointLight position={[0, -10, -10]} intensity={0.5} />
<T.PointLight position={[0, 0, -10]} intensity={0.5} />

<!-- Add a directional light to simulate sunlight -->
<T.DirectionalLight position={[5, 10, 7]} intensity={0.8} castShadow />

<GLTF
	url={selectedObject}
	scale={3.0}
	onError={(error) => console.error('Error loading GLTF:', error)}
/>

<Sky />
