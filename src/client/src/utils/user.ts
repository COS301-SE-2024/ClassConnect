import { hash } from '@node-rs/argon2';
import { fail, error } from '@sveltejs/kit';

import type { User } from '$src/types';
import type { ObjectId } from 'mongoose';

import Users from '$db/schemas/User';
import { HASH_OPTIONS } from '$src/constants';
import { generateUsername } from '$utils/auth';
import { upload, deleteFile } from '$lib/server/storage';

export function formatUser(user: any): User {
	return {
		id: user._id.toString(),
		name: user.name,
		email: user.email,
		image: user.image,
		surname: user.surname,
		username: user.username
	};
}

export async function getUsers(role: string, organisation: ObjectId | undefined): Promise<User[]> {
	const users = await Users.find({ role, organisation });
	return users.map(formatUser);
}

export function validateUser(locals: any, requiredRole: string) {
	if (!locals.user || locals.user.role !== requiredRole) {
        console.log('#################################################################################');
		throw error(401, `Only ${requiredRole}s can access this page`);
	}
}

export async function addUser(data: FormData, organisation: ObjectId | undefined, role: string) {
	const name = data.get('name') as string;
	const email = data.get('email') as string;
	const image_file = data.get('image') as File;
	const surname = data.get('surname') as string;

	const existingUser = await Users.findOne({ email });
	if (existingUser) return fail(400, { error: 'Email already in use' });

	let image: string = '/images/profile-placeholder.png';
	if (image_file && image_file.size !== 0) image = await upload(image_file);

	const username = generateUsername(role, email);
	const hashedPassword = await hash(username, HASH_OPTIONS);

	const newUser = new Users({
		name,
		role,
		email,
		image,
		surname,
		username,
		organisation,
		password: hashedPassword
	});

	await newUser.save();
	return { success: true };
}

export async function editUser(data: FormData) {
	const id = data.get('id') as string;
	const image = data.get('image') as File;

	const updateData: Partial<User> = {};

	['name', 'email', 'surname'].forEach((field) => {
		const value = data.get(field) as string;
		if (value !== '') updateData[field as keyof Partial<User>] = value;
	});

	if (image && image.size !== 0) {
		const { image: userImage } = await Users.findById(id).select('image');

		if (userImage !== '/images/profile-placeholder.png') await deleteFile(userImage);

		updateData.image = await upload(image);
	}

	const updatedUser = await Users.findByIdAndUpdate(id, updateData, { new: true });
	if (!updatedUser) return fail(404, { error: 'User not found' });

	return { success: true };
}

export async function deleteUser(id: string) {
	if (!id) return fail(400, { error: 'User ID is required' });

	const deletedUser = await Users.findByIdAndDelete(id);
	if (!deletedUser) return fail(404, { error: 'User not found' });

	return { success: true };
}
