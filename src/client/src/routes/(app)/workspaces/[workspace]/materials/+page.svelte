<script lang="ts">
	import { Tabs } from 'flowbite-svelte'
	import MaterialsTab from '$src/lib/components/materials/MaterialsTab.svelte';
	
	export let data: any;
	let foundMaterials : any[] = [];
	let DocumentMaterials : any[] = [];
	let ObjectMaterials : any[] = [];
	$:({materials}= data)

	$: {
		materials = materials.map((material: any) => ({
			...material,
	
		}));
		foundMaterials = materials;
		for (let i = 0; i < materials.length; i++) {
			if (!materials[i].type) {
				DocumentMaterials.push(materials[i]);
			} else {
				ObjectMaterials.push(materials[i]);
			}
		}
	}

</script>

<div class="mt-2">
	<Tabs>
		<MaterialsTab tabName="All" tabBoolean={true} renderedMaterials={foundMaterials} />

		<MaterialsTab tabName="Documents" tabBoolean={false} renderedMaterials={DocumentMaterials} />

		<MaterialsTab tabName="3D Objects" tabBoolean={false} renderedMaterials={ObjectMaterials} />
	</Tabs>
</div>