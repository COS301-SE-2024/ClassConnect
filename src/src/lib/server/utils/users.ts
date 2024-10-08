import { hash } from '@node-rs/argon2';
import { parse } from 'csv-parse/sync';
import { fail, error } from '@sveltejs/kit';

import type { User } from '$src/types';
import type { ObjectId } from 'mongoose';

import Users from '$db/schemas/User';
import { generateUsername } from './auth';
import { sendWelcomeEmail } from './email';
import { HASH_OPTIONS } from '$src/constants';
import { upload, deleteFile } from '../storage';
import Organisation from '$db/schemas/Organisation';

export function formatUser(user: any): User {
	return {
		id: user._id.toString(),
		name: user.name,
		email: user.email,
		image: user.image,
		surname: user.surname,
		username: user.username,
		workspaces: user.workspaces ? user.workspaces.map((ws: any) => ws.toString()) : []
	};
}

export async function getUsers(role: string, organisation: ObjectId | undefined): Promise<User[]> {
	const users = await Users.find({ role, organisation });
	return users.map(formatUser);
}

export function validateUser(locals: any, requiredRole: string) {
	if (!locals.user || locals.user.role !== requiredRole) {
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

	const password = Math.random().toString(36).slice(-8);
	const hashedPassword = await hash(password, HASH_OPTIONS);

	const organisationData = await Organisation.findById(organisation).select('name');

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
	sendWelcomeEmail(email, role, name, username, password, organisationData.name);

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

	const { image } = deletedUser;
	if (image !== '/images/profile-placeholder.png') await deleteFile(image);

	if (!deletedUser) return fail(404, { error: 'User not found' });

	return { success: true };
}

export async function addUsers(csvFile: File, organisation: ObjectId | undefined, role: string) {
	const fileContent = await csvFile.text();
	const records = parse(fileContent, { columns: true, skip_empty_lines: true });

	console.log(records);

	for (const record of records) {
		const { name, surname, email } = record;

		const formData = new FormData();
		formData.append('name', name);
		formData.append('email', email);
		formData.append('surname', surname);

		await addUser(formData, organisation, role);
	}
}
