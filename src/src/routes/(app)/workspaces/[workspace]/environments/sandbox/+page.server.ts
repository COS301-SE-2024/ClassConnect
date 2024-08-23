import { error } from '@sveltejs/kit';
import type { Material } from '$src/types';
import Materials from '$db/schemas/Material';

function formatModel(model: any): Partial<Material> {
	return {
		title: model.title,
		file_path: model.file_path,
		description: model.description
	};
}

async function getModels(workspace_id: string, type: boolean): Promise<Partial<Material>[]> {
	const models = await Materials.find({ workspace_id, type });
	return models.map(formatModel);
}

export async function load({ params }: any) {
	try {
		const models = await getModels(params.workspace, true);

		return { models };
	} catch (e) {
		console.error('Sandbox error:', e);
		throw error(500, 'An unexpected error occurred while loading models');
	}
}
