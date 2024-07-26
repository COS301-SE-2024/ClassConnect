<script lang="ts">
	import { Tabs } from 'flowbite-svelte';
	import MaterialsTab from '$src/lib/components/materials/MaterialsTab.svelte';
	import { onMount } from 'svelte';

	export let data: any;
	let materials: any[] = [];
	let DocumentMaterials: any[] = [];
	let ObjectMaterials: any[] = [];

	onMount(() => {
		console.log('This is the data passed in: ', data.materials);
		materials = data.materials;
		ObjectMaterials = data.materials.filter((material: any) => material.type);
		DocumentMaterials = data.materials.filter((material: any) => !material.type);
	});
</script>

<div class="mt-2">
	<Tabs>
		<MaterialsTab tabName="All" tabBoolean={true} renderedMaterials={materials} />

		<MaterialsTab tabName="Documents" tabBoolean={false} renderedMaterials={DocumentMaterials} />

		<MaterialsTab tabName="3D Objects" tabBoolean={false} renderedMaterials={ObjectMaterials} />
	</Tabs>
</div>