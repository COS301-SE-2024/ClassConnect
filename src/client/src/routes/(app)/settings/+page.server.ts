import Users from '$db/schemas/User';
import { fail } from '@sveltejs/kit';
import { HASH_OPTIONS } from '$src/constants';
import { verify, hash } from '@node-rs/argon2';
import { upload, deleteFile } from '$src/lib/server/storage';
import type { User } from '$src/types';
import type { ObjectId } from 'mongoose';
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

async function getUserDetails(user_id: ObjectId): Promise<User> {
	const USER = await Users.findById(user_id);
	const ret_user: User = {
		id: USER._id.toString(),
		name: USER.name,
		email: USER.email,
		image: USER.image,
		surname: USER.surname,
		username: USER.username
	};

	return ret_user;
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

async function deleteFromS3(locals: any) {
	try {
		if (locals.user) {
			const user_id: ObjectId = locals.user.id;
			const user = await Users.findById(user_id);
			if (user.image) {
				if (
					user.image !==
						'https://class-connect-file-storage.s3.amazonaws.com/pictures/default.svg' &&
					user.image !== 'images/profile-placeholder.png'
				) {
					await deleteFile(user.image);
					user.image = 'https://class-connect-file-storage.s3.amazonaws.com/pictures/default.svg';
					await user.save();
					return {
						image_url: 'https://class-connect-file-storage.s3.amazonaws.com/pictures/default.svg'
					};
				}
			}
		}
	} catch (err) {
		console.error('Error deleting image:', err);
		return fail(500, { error: 'Failed to delete image' });
	}
}

async function verifyOldPassword(objID: ObjectId, old_password: string): Promise<boolean> {
	const user = await Users.findById(objID);
	if (!user) return false;

	const valid = await verify(user.password, old_password);
	if (!valid) return false;

	return true;
}

function validatePassword(password: string | null, confirmPassword: string | null): string {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{6,}$/;

	if (typeof password !== 'string' || !passwordRegex.test(password))
		throw new Error('Invalid password');

	if (password !== confirmPassword) throw new Error('Passwords do not match');

	return password;
}

async function updatePassword(userID: ObjectId, password: string) {
	const hashedPassword = await hash(password, HASH_OPTIONS);

	const newPassword = {
		password: hashedPassword
	};
	await Users.findByIdAndUpdate(userID, newPassword);
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
