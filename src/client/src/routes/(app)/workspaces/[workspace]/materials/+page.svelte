<script lang="ts">
	import { Tabs } from 'flowbite-svelte';
	import MaterialsTab from '$src/lib/components/common/materials/MaterialsTab.svelte';

	export let data: any;
	let foundMaterials: any[] = [];
	let found3DMaterials: any[] = [];
	let foundDocumentMaterials: any[] = [];

	$: ({ role, materials } = data);

	$: {
		materials = materials.map((material: any) => ({
			...material
		}));
		foundMaterials = materials;

		found3DMaterials = materials.filter((material: any) => {
			return material.type === 'object';
		});

		foundDocumentMaterials = materials.filter((material: any) => {
			return material.type === 'study-material' || material.type === 'image';
		});
	}
</script>

<div class="p-4">
	<h1 class="text-2xl font-bold dark:text-white">Materials</h1>
	<div class="mt-2">
		<Tabs>
			<MaterialsTab tabName="All" tabBoolean={true} renderedMaterials={foundMaterials} {role} />

			<MaterialsTab
				tabName="Documents"
				tabBoolean={false}
				renderedMaterials={foundDocumentMaterials}
				{role}
			/>

			<MaterialsTab
				tabName="3D Objects"
				tabBoolean={false}
				renderedMaterials={found3DMaterials}
				{role}
			/>
		</Tabs>
	</div>
</div>
