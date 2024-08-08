import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import type { ObjectId } from 'mongoose';
import { fail, error } from '@sveltejs/kit';
import { upload, deleteFile } from '$lib/server/storage';

import Users from '$db/schemas/User';
import type { User } from '$src/types';
import { HASH_OPTIONS } from '$src/constants';
import { generateUsername } from '$utils/user';

function formatAdmin(admin: any): User {
	return {
		id: admin._id.toString(),
		name: admin.name,
		email: admin.email,
		image: admin.image,
		surname: admin.surname,
		username: admin.username
	};
}

async function getAdmins(organisation: ObjectId): Promise<User[]> {
	const admins = await Users.find({ role: 'admin', organisation });

	return admins.map(formatAdmin);
}

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') throw error(401, 'Only admins can access this page');
	console.log(locals.user?.organisation);

	try {
		let organisation = locals.user?.organisation;
		if(organisation !== undefined || organisation !== null) {
			organisation = JSON.parse(JSON.stringify(locals.user?.organisation));
		}
		const admins = await getAdmins(organisation);


		return {  organisation, admins };
	} catch (e) {
		console.error('Failed to load admins:', e);
		throw error(500, 'Error occurred while fetching admins');
	}
}

function validateAdmin(locals: any) {
	if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');
}

async function addAdmin(data: FormData, organisation: ObjectId | undefined) {
	const name = data.get('name') as string;
	const email = data.get('email') as string;
	const image_file = data.get('image') as File;
	const surname = data.get('surname') as string;

	let image: string = '/images/profile-placeholder.png';

	const existingUser = await Users.findOne({ email });
	if (existingUser) return fail(400, { error: 'Email already in use' });

	if (image_file && image_file.size !== 0) {
		image = await upload(image_file);
	}
	const username = generateUsername('admin', email);
	const hashedPassword = await hash(username, HASH_OPTIONS);

	const newAdmin = new Users({
		name,
		email,
		surname,
		username,
		organisation,
		role: 'admin',
		password: hashedPassword,
		image
	});

	await newAdmin.save();
	return { success: true };
}

async function editAdmin(data: FormData) {
	const id = data.get('id') as string;
	const image = data.get('image') as File;

	const updateData: Partial<User> = {};

	['name', 'email', 'surname'].forEach((field) => {
		const value = data.get(field) as string;
		if (value !== '') updateData[field as keyof Partial<User>] = value;
	});

	if (image.size !== 0) {
		const { image: userImage } = await Users.findById(id).select('image');

		if (userImage !== '/images/profile-placeholder.png') await deleteFile(userImage);

		updateData.image = await upload(image);
	}

	const updatedStudent = await Users.findByIdAndUpdate(id, updateData, { new: true });
	if (!updatedStudent) return fail(404, { error: 'Student not found' });

	return { success: true };
}

async function deleteAdmin(id: string) {
	if (!id) return fail(400, { error: 'Admin ID is required' });

	const deletedAdmin = await Users.findByIdAndDelete(id);
	if (!deletedAdmin) return fail(404, { error: 'Admin not found' });

	return { success: true };
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();

			return await addAdmin(data, locals.user?.organisation);
		} catch (error) {
			console.error('Error adding admin:', error);
			return fail(500, { error: 'Failed to add admin' });
		}
	},

	edit: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();

			return await editAdmin(data);
		} catch (err) {
			console.error('Error updating admin:', err);
			return fail(500, { error: 'Failed to update admin' });
		}
	},

	delete: async ({ request, locals }) => {
		validateAdmin(locals);

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
