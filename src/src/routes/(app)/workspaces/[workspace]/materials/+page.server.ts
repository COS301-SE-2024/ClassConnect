import type { Actions } from './$types';
import type { UploadData, UploadInfo } from '$src/types';
import { fail, error } from '@sveltejs/kit';
import { determineFolderFromName } from '$lib/server/storage';
import { uploadFile, multipartUploadFile } from '$lib/server/UploadHandler';
import { validateLecturer } from '$src/lib/server/utils';
import { getMaterials } from '$src/lib/server/utils/material';
import { deleteMaterial } from '$src/lib/server/utils/material';

export async function load({ locals, params }) {
	try {
		const materials = await getMaterials(params.workspace);
		return {
			role: locals.user?.role,
			materials
		};
	} catch (e) {
		console.error('Server error:', e);
		throw error(500, 'An unexpected error occurred while loading materials');
	}
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

			await uploadFile(upload_data);
		} catch (e) {
			console.error('Error uploading material:', e);
			return fail(500, { message: 'Failed to upload material' });
		}
	},
	multiPartUploadFinal: async ({ request, locals, params }) => {
		validateLecturer(locals);
		try {
			const data = await request.formData();

			const upload_data: UploadInfo = {
				link: data.get('link') as string,
				title: data.get('title') as string,
				description: data.get('description') as string,
				workspace: params.workspace
			};

			const name = data.get('name') as string;
			const folder = determineFolderFromName(name);

			await multipartUploadFile(upload_data, folder);
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
