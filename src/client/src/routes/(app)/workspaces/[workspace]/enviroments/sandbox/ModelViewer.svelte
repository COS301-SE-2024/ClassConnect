<script lang="ts">
	import { T } from '@threlte/core';
	import { Box3, Vector3 } from 'three';
	import { GLTF, OrbitControls } from '@threlte/extras';

	import type { Object3D } from 'three';

	import Menu from './Menu.svelte';

	export let currentModel: string;

	const normalizeModel = (object: Object3D) => {
		const box = new Box3().setFromObject(object);

		const size = box.getSize(new Vector3());
		const center = box.getCenter(new Vector3());

		const maxDim = Math.max(size.x, size.y, size.z);

		const scale = 1 / maxDim;
		const position = center.multiplyScalar(-1);

		return { scale, position };
	};

	const handleModelCreate = ({ ref }: { ref: Object3D }) => {
		const { scale, position } = normalizeModel(ref);

		ref.scale.setScalar(scale);
		ref.position.copy(position);
	};
</script>

<T.PerspectiveCamera
	fov={25}
	makeDefault
	position={[0, 0, 5]}
	on:create={({ ref }) => ref.lookAt(0, 0, 0)}
>
	<Menu />
	<OrbitControls autoRotate enableDamping />
</T.PerspectiveCamera>

<T.AmbientLight intensity={1} />

<GLTF url={currentModel} on:create={handleModelCreate} />
