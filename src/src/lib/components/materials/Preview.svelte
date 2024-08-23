<script lang="ts">
	import { T } from '@threlte/core';
	import { OrbitControls, Sky, GLTF } from '@threlte/extras';

	//Max Zoom Out
	const maxZoomOutDistance = 100;

	export let mat_url: string;

	// 3D Object Preview
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

<GLTF url={mat_url} <!-- scale={0.05} /> -->

<Sky />
