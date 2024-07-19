<script lang="ts">
	import { Tabs } from 'flowbite-svelte'
	import MaterialsTab from '$src/lib/components/common/materials/MaterialsTab.svelte';
	
	export let data: any;
	let foundMaterials : any[] = [];

	$:({role,materials}= data)

	$: {
		materials = materials.map((material: any) => ({
			...material,
	
		}));
		foundMaterials = materials;

		
	}

</script>

<div class="p-4">
    <h1 class="text-2xl font-bold dark:text-white">Materials</h1>
	<div class="mt-2">
		<Tabs>
				<MaterialsTab tabName="All" tabBoolean={true} renderedMaterials={foundMaterials} />

				<MaterialsTab tabName="Documents" tabBoolean={false} renderedMaterials={foundMaterials} />

				<MaterialsTab tabName="3D Objects" tabBoolean={false} renderedMaterials={foundMaterials} />
		</Tabs>
	</div>
</div>