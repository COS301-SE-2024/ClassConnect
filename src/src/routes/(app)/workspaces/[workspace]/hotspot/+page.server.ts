// import Users from '$db/schemas/User';
import { fail } from '@sveltejs/kit';
import type { Material } from '$src/types';
import Materials from '$db/schemas/Material';
import { error } from '@sveltejs/kit';

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

export async function load({ locals, params }) {
    if (!locals.user ) {
        throw error(401, 'Unauthorised');
    }
    else{
        const models = await getModels(params.workspace, true);
        const role=locals.user.role;
        return {role};
    }
}

// async function uploadToS3(image: File, locals: any) {
// 	const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
// 	if (image.size > maxFileSize) {
// 		return fail(400, { error: 'File size too large' });
// 	}
// 	try {
// 		if (locals.user) {
// 			const user_id: ObjectId = locals.user.id;
// 			const user = await Users.findById(user_id);
// 			const image_url = await upload(image);
// 			user.image = image_url;
// 			await user.save();
// 			return { image_url };
// 		}
// 	} catch (err) {
// 		console.error('Error uploading image:', err);
// 		return fail(500, { error: 'Failed to upload image' });
// 	}
// }
