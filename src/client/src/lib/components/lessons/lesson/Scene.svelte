<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { T, useFrame } from '@threlte/core';
	import { OrbitControls } from '@threlte/extras';
	import { insertCoin, isHost, onPlayerJoin, setState, getState } from 'playroomkit';
	import {
		BoxGeometry,
		MeshStandardMaterial,
		Vector3,
		PerspectiveCamera,
		SphereGeometry,
		ConeGeometry
	} from 'three';

	let players: any[] = [];
	let camera: PerspectiveCamera;
	let cameraPosition = new Vector3();
	export let selectedObject = 'box';

	const objects: { [key: string]: BoxGeometry | SphereGeometry | ConeGeometry } = {
		box: new BoxGeometry(2, 2, 2),
		sphere: new SphereGeometry(1, 32, 32),
		cone: new ConeGeometry(1, 2, 32)
	};

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
</script>

<T.PerspectiveCamera makeDefault position={[10, 5, 10]} lookAt.y={0.5} bind:ref={camera}>
	<OrbitControls enableDamping />
</T.PerspectiveCamera>

<T.DirectionalLight position.y={10} position.z={10} />
<T.AmbientLight intensity={0.3} />
<T.GridHelper args={[10, 10]} />

<T.Mesh position.y={1} geometry={objects[selectedObject]} material={new MeshStandardMaterial()} />
