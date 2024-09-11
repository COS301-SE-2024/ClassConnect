import { fail } from '@sveltejs/kit';
import type { Material } from '$src/types';
import Materials from '$db/schemas/Material';
import { deleteFile } from '$lib/server/storage';

export function formatMaterial(material: any): Partial<Material> {
	return {
		title: material.title,
		description: material.description,
		file_path: material.file_path,
		thumbnail: material.thumbnail,
		type: material.type,
		id: material._id.toString()
	};
}

export async function deleteMaterial(id: string) {
	if (!id) return fail(400, { message: 'Material ID is required' });

	const material = await Materials.findById(id);

	if (material) {
		const file_path = material.file_path;
		const thumbnail = material.thumbnail;

		if (file_path) {
			try {
				await deleteFile(file_path);
			} catch (e) {
				console.error('Error deleting file:', e);
			}
		}

		if (thumbnail) {
			try {
				await deleteFile(thumbnail);
			} catch (e) {
				console.error('Error deleting thumbnail:', e);
			}
		}
	} else {
		return fail(404, { message: 'Material not found' });
	}

	const deletedMaterial = await Materials.findByIdAndDelete(id);

	if (!deletedMaterial) return fail(404, { message: 'Material not found' });

	return { success: true };
}

export async function getMaterials(workspace_id: string): Promise<Partial<Material>[]> {
	const materials = await Materials.find({ workspace_id });
	return materials.map(formatMaterial);
}
