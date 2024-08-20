<script lang="ts">
	import { T } from '@threlte/core';
	import { Align, Environment, Float, Stars, Text3DGeometry } from '@threlte/extras';

	import Menu from '$lib/components/sandbox/Menu.svelte';
</script>

<Float rotationIntensity={[0, 3, 0]} rotationSpeed={1} floatingRange={[-5, 5]} speed={1}>
	<T.PerspectiveCamera
		fov={90}
		makeDefault
		position.y={0}
		position.z={20}
		on:create={({ ref }) => ref.lookAt(0, 0, 0)}
	>
		<Menu />
	</T.PerspectiveCamera>
</Float>

<Align let:align>
	<T.Mesh>
		<Text3DGeometry
			size={5}
			depth={1}
			smooth={0.1}
			text="SandBox"
			bevelOffset={0}
			bevelSize={0.2}
			on:create={align}
			curveSegments={12}
			bevelSegments={20}
			bevelEnabled={true}
			bevelThickness={0.1}
		/>
		<T.MeshStandardMaterial color="#11FF00" metalness={1.0} roughness={0.1} toneMapped={false} />
	</T.Mesh>
</Align>

<Stars />
<Environment files="/environment/shanghai.hdr" />
