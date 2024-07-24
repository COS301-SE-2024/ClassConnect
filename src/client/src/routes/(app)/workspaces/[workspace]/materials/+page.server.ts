import type { Actions } from './$types';
import Materials from '$db/schemas/Material';
import type { Material } from '$src/types';
import type { UploadData } from '$src/types';
import { fail, error } from '@sveltejs/kit';
import { deleteFile } from '$lib/server/s3Bucket';
import { uploadFile } from '$lib/server/UploadHandler';

function formatMaterial(material: any): Partial<Material> {
	return {
		title: material.title,
		description: material.description,
		file_path: material.file_path,
		thumbnail: material.thumbnail,
		type: material.type,
		id: material._id.toString()
	};
}

async function getMaterials(workspace_id: string): Promise<Partial<Material>[]> {
	const materials = await Materials.find({ workspace_id });
	return materials.map(formatMaterial);
}

export async function load({ locals, params }) {
	try {
		const materials = await getMaterials(params.workspace);
		return {
			role: locals.user?.role,
			materials
		};
	} catch (e) {
		console.error('Server error:', e);
		throw error(500, 'An unexpected error occurred while loading lessons');
	}
}

function validateLecturer(locals: any) {
	if (!locals.user || locals.user.role !== 'lecturer') throw error(401, 'Unauthorized');
}

async function deleteMaterial(id: string) {
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

export const actions: Actions = {
	uploadMat: async ({ request, locals, params }) => {
		validateLecturer(locals);
		try {
			const data = await request.formData();

			const upload_data: UploadData = {
				file: data.get('file') as File,
				title: data.get('title') as string,
				description: data.get('description') as string,
				workspace: params.workspace
			};

			const mat = await uploadFile(upload_data);

			console.log(mat);
		} catch (e) {
			console.error('Error uploading material:', e);
			return fail(500, { message: 'Failed to upload material' });
		}
	},
	deleteMat: async ({ request, locals }) => {
		validateLecturer(locals);
		try {
			const data = await request.formData();
			const id = data.get('id') as string;
			return await deleteMaterial(id);
		} catch (e) {
			console.error('Error deleting material:', e);
			return fail(500, { message: 'Failed to delete material' });
		}
	},
	submitObjects: async ({ request }) => {
		const data = await request.formData();
		const selectedObjects = data.getAll('selectedObjects') as string[];
		console.log(data);

		console.log('Selected object IDs:', selectedObjects);

		return {
			success: true,
			message: 'Objects submitted successfully'
		};
	}
};
