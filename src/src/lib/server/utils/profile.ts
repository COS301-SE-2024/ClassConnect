import Users from '$db/schemas/User';
import type { User } from '$src/types';
import type { ObjectId } from 'mongoose';
import { fail } from '@sveltejs/kit';
import { HASH_OPTIONS } from '$src/constants';
import { verify, hash } from '@node-rs/argon2';
import { upload, deleteFile } from '$src/lib/server/storage';

export async function getUserDetails(user_id: ObjectId): Promise<User> {
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

export async function uploadToS3(image: File, locals: any) {
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

export async function deleteFromS3(locals: any) {
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

export async function verifyOldPassword(objID: ObjectId, old_password: string): Promise<boolean> {
	const user = await Users.findById(objID);
	if (!user) return false;

	const valid = await verify(user.password, old_password);
	if (!valid) return false;

	return true;
}

export function validatePassword(password: string | null, confirmPassword: string | null): string {
	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{6,}$/;

	if (typeof password !== 'string' || !passwordRegex.test(password))
		throw new Error('Invalid password');

	if (password !== confirmPassword) throw new Error('Passwords do not match');

	return password;
}

export async function updatePassword(userID: ObjectId, password: string) {
	const hashedPassword = await hash(password, HASH_OPTIONS);

	const newPassword = {
		password: hashedPassword
	};
	await Users.findByIdAndUpdate(userID, newPassword);
}
