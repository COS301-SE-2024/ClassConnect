<script lang="ts">
	import { Tabs } from 'flowbite-svelte';
	import MaterialsTab from '$src/lib/components/materials/MaterialsTab.svelte';
	import { onMount } from 'svelte';

	export let data: any;
	let materials: any[] = [];
	let DocumentMaterials: any[] = [];
	let ObjectMaterials: any[] = [];
	let role = data.role;

	onMount(() => {
		materials = data.materials;
		ObjectMaterials = data.materials.filter((material: any) => material.type);
		DocumentMaterials = data.materials.filter((material: any) => !material.type);
	});
</script>

<div class="mt-2">
	<Tabs contentClass='p-4 px-8'>
		<MaterialsTab tabName="All" tabBoolean={true} renderedMaterials={materials} role={role} />

		<MaterialsTab tabName="Documents" tabBoolean={false} renderedMaterials={DocumentMaterials} role={role} />

		<MaterialsTab tabName="3D Objects" tabBoolean={false} renderedMaterials={ObjectMaterials} role={role} />
	</Tabs>
</div>
