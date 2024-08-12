<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { T, useFrame } from '@threlte/core';
	import { Vector3, PerspectiveCamera } from 'three';
	import { OrbitControls, GLTF, Sky } from '@threlte/extras';
	import { insertCoin, isHost, onPlayerJoin, setState, getState } from 'playroomkit';

	let players: any[] = [];
	let camera: PerspectiveCamera;
	let cameraPosition = new Vector3();

	export let selectedObject: string = '';

	async function init() {
		await insertCoin({ skipLobby: true, roomCode: $page.params.lesson });

		onPlayerJoin((state) => {
			players = players.filter((p) => p.id !== state.id);
			players = [...players, state];

			state.onQuit(() => {
				players = players.filter((p) => p.id !== state.id);
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
				setState('cameraPosition', {
					x: cameraPosition.x,
					y: cameraPosition.y,
					z: cameraPosition.z
				});

				setState('selectedObject', selectedObject);
			} else {
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

<T.PerspectiveCamera makeDefault position={[0, 0, 45]} fov={75} bind:ref={camera}>
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

<T.AmbientLight intensity={0.9} />
<T.PointLight position={[0, 10, 10]} intensity={0.5} />
<T.PointLight position={[0, -10, 10]} intensity={0.5} />
<T.PointLight position={[10, 10, 0]} intensity={0.5} />
<T.PointLight position={[-10, -10, 0]} intensity={0.5} />
<T.PointLight position={[0, -10, -10]} intensity={0.5} />
<T.PointLight position={[0, 0, -10]} intensity={0.5} />
<T.DirectionalLight position={[5, 10, 7]} intensity={0.8} castShadow />

{#if selectedObject}
	<GLTF
		url={selectedObject}
		scale={3.0}
		onError={(error) => console.error('Error loading GLTF:', error)}
	/>
{/if}

<Sky />
