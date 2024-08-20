import Users from '$db/schemas/User';
import { fail } from '@sveltejs/kit';

import { upload} from '$src/lib/server/storage';
import { error } from '@sveltejs/kit';
import type { Actions } from './$types';

import type { ObjectId } from 'mongoose';


export async function load({ locals }) {
    if (!locals.user || locals.user.role !== 'student') {
        throw error(401, 'Unauthorised');
    }
}

async function uploadToS3(image: File, locals: any) {
	const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
	if (image.size > maxFileSize) {
		return fail(400, { error: 'File size too large' });
	}
	try {
		if (locals.user) {
			const user_id: ObjectId = locals.user.id;
			const user = await Users.findById(user_id);
			const image_url = await upload(image);
			user.image = image_url;
			await user.save();
			return { image_url };
		}
	} catch (err) {
		console.error('Error uploading image:', err);
		return fail(500, { error: 'Failed to upload image' });
	}
}

export const actions: Actions = {
	upload_picture: async ({ request, locals }) => {
		try {
			const data = await request.formData();
			const image_file: File = data.get('file') as File;
			if (locals) {
				await uploadToS3(image_file, locals);
			}
		} catch (error) {
			console.error('Error adding lecturer:', error);
			return fail(500, { error: 'Failed to upload picture' });
		}
	}
}