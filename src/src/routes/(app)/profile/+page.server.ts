import Users from '$db/schemas/User';
import type { ObjectId } from 'mongoose';
import { fail } from '@sveltejs/kit';
import {
	getUserDetails,
	uploadToS3,
	deleteFromS3,
	validatePassword,
	verifyOldPassword,
	updatePassword
} from '$src/lib/server/utils/profile';
import type { Actions } from './$types';

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
	if (locals.user) {
		const user_id: ObjectId = locals.user.id;
		const ret_user = await getUserDetails(user_id);
		return {
			user_data: ret_user
		};
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
	},
	delete_picture: async ({ locals }) => {
		try {
			await deleteFromS3(locals);
		} catch (err) {
			console.error('Error deleteing picture:', err);
			return fail(500, { error: 'Failed to delete picture' });
		}
	},
	update_general_details: async ({ request, locals }) => {
		try {
			const data = await request.formData();
			const name: string | null = data.get('name') as string;
			const surname: string | null = data.get('surname') as string;
			const email: string | null = data.get('email') as string;

			const GeneralDetails: { [key: string]: string } = {};

			if (name) GeneralDetails.name = name;
			if (surname) GeneralDetails.surname = surname;
			if (email) GeneralDetails.email = email;

			if (locals && locals.user) {
				await Users.findByIdAndUpdate(locals.user.id, GeneralDetails);
			}
		} catch (err) {
			console.error('Error updating details:', err);
			return fail(500, { error: 'Failed to update general details' });
		}
	},
	update_password: async ({ request, locals }) => {
		try {
			const data = await request.formData();
			const old_password: string = data.get('currPassword') as string;
			const password: string = data.get('newPassword') as string;
			const confirm_password: string = data.get('conPassword') as string;

			if (locals && locals.user) {
				const objID: ObjectId = locals.user.id;
				const valid = await verifyOldPassword(objID, old_password);
				if (!valid) {
					return fail(400, { error: 'Invalid password' });
				}
				const validPassword = validatePassword(password, confirm_password);
				if (validPassword) {
					await updatePassword(objID, validPassword);
				}
			}
		} catch (err) {
			console.error('Error updating password:', err);
			return fail(500, { error: 'Failed to update password' });
		}
	}
};
