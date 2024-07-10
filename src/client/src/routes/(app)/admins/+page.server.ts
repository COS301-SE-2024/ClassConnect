import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import type { Admin } from '$src/types';
import type { ObjectId } from 'mongoose';
import { fail, error } from '@sveltejs/kit';

import User from '$db/schemas/User';
import { HASH_OPTIONS } from '$src/constants';
import { generateUsername } from '$utils/user';

function formatAdmin(admin: any): Admin {
	return {
		id: admin._id.toString(),
		name: admin.name,
		email: admin.email,
		image: admin.image,
		surname: admin.surname,
		username: admin.username
	};
}

async function getAdmins(organisation: ObjectId): Promise<Admin[]> {
	const admins = await User.find({ role: 'admin', organisation });

	return admins.map(formatAdmin);
}

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') throw error(401, 'Only admins can access this page');

	try {
		const admins = await getAdmins(locals.user.organisation);

		return { admins };
	} catch (e) {
		console.error('Failed to load admins:', e);
		throw error(500, 'Failed to load admins');
	}
}

async function addAdmin(data: FormData, organisation: ObjectId) {
	const name = data.get('name') as string;
	const email = data.get('email') as string;
	const image = data.get('image') as string;
	const surname = data.get('surname') as string;

	const existingUser = await User.findOne({ email });
	if (existingUser) return fail(400, { error: 'Email already in use' });

	const username = generateUsername('admin', email);
	const hashedPassword = await hash(username, HASH_OPTIONS);

	const newAdmin = new User({
		name,
		email,
		surname,
		username,
		organisation,
		role: 'admin',
		password: hashedPassword,
		image: image || '/images/profile-placeholder.png'
	});

	await newAdmin.save();
	return { success: true };
}

async function editAdmin(data: FormData) {
	const id = data.get('id') as string;
	if (!id) return fail(400, { error: 'Admin ID is required' });

	const updateData: Partial<Admin> = {};

	['name', 'email', 'image', 'surname'].forEach((field) => {
		const value = data.get(field) as string;

		if (value !== '') updateData[field as keyof Partial<Admin>] = value;
	});

	const updatedAdmin = await User.findByIdAndUpdate(id, updateData, { new: true });
	if (!updatedAdmin) return fail(404, { error: 'Admin not found' });

	return { success: true };
}

async function deleteAdmin(id: string) {
	if (!id) return fail(400, { error: 'Admin ID is required' });

	const deletedAdmin = await User.findByIdAndDelete(id);
	if (!deletedAdmin) return fail(404, { error: 'Admin not found' });

	return { success: true };
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		try {
			const data = await request.formData();
			return await addAdmin(data, locals.user.organisation);
		} catch (error) {
			console.error('Error adding admin:', error);
			return fail(500, { error: 'Failed to add admin' });
		}
	},

	edit: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		try {
			const data = await request.formData();
			return await editAdmin(data);
		} catch (err) {
			console.error('Error updating admin:', err);
			return fail(500, { error: 'Failed to update admin' });
		}
	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		try {
			const data = await request.formData();
			const id = data.get('id') as string;
			return await deleteAdmin(id);
		} catch (err) {
			console.error('Error removing admin:', err);
			return fail(500, { error: 'Failed to remove admin' });
		}
	}
};
