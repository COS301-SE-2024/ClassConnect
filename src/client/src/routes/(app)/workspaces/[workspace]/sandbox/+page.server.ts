import Materials from '$db/schemas/Material';
import type { Material } from '$src/types';
import { error } from '@sveltejs/kit';

function formatMaterial(material: any): Partial<Material> {
	return {
		title: material.title,
		description: material.description,
		file_path: material.file_path
	};
}

async function get3DMaterials(workspace_id: string, type: boolean): Promise<Partial<Material>[]> {
	const materials = await Materials.find({ workspace_id, type });
	return materials.map(formatMaterial);
}

export async function load({ params }) {
	try {
		const materials = await get3DMaterials(params.workspace, true);
		return {
			materials
		};
	} catch (e) {
		console.error('Server error:', e);
		throw error(500, 'An unexpected error occurred while loading lessons');
	}
}
