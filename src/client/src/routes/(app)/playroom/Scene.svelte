<script lang="ts">
	import * as THREE from 'three';
	import { T } from '@threlte/core';
	import { GLTF, HTML, OrbitControls } from '@threlte/extras';

	function normalizeModel(object: THREE.Object3D): { scale: number; position: THREE.Vector3 } {
		const box = new THREE.Box3().setFromObject(object);
		const size = box.getSize(new THREE.Vector3());
		const maxDim = Math.max(size.x, size.y, size.z);
		const center = box.getCenter(new THREE.Vector3());

		const scale = 1 / maxDim;
		const position = center.multiplyScalar(-1);

		return { scale, position };
	}
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 5]} fov={25}>
	<OrbitControls autoRotate enableDamping />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1} />

<GLTF
	url="/models/golden_eagle-v1.glb"
	on:create={({ ref }) => {
		const { scale, position } = normalizeModel(ref);
		ref.scale.setScalar(scale);
		ref.position.copy(position);
	}}
/>

<HTML>
	<h1>Threlte</h1>
	<p>Threlte is a 3D rendering engine for the web.</p>
	<button on:click={() => console.log('Hello, Threlte!')}>Click me</button>
</HTML>
