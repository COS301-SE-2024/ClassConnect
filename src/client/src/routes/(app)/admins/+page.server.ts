import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';
import { upload, deleteFile } from '$lib/server/s3Bucket';

import User from '$db/schemas/User';
import { HASH_OPTIONS } from '$src/constants';
import { generateUsername } from '$utils/user';

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') throw error(401, 'Unauthorised');

	try {
		const admins = await User.find({ role: 'admin', organisation: locals.user.organisation });

		const formattedAdmins = admins.map((admin) => ({
			id: admin._id.toString(),
			name: admin.name,
			email: admin.email,
			image: admin.image,
			surname: admin.surname,
			username: admin.username
		}));

		return {
			admins: formattedAdmins
		};
	} catch (error) {
		console.error('Failed to load admins:\n', error);
		return fail(500, { error: 'An unexpected error occurred while fetching admins' });
	}
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		let image : string = 'https://images.unsplash.com/photo-1719953145985-8fd3b5d69d58?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
		const img = data.get('image') as File;
		const surname = data.get('surname') as string;

		console.log('here at add')

		image = await upload(img);

		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) return fail(400, { error: 'Email already in use' });

			const username = generateUsername('admin', email);
			const hashedPassword = await hash(username, HASH_OPTIONS);

			const newAdmin = new User({
				name,
				surname,
				email,
				username,
				role: 'admin',
				password: hashedPassword,
				organisation: locals.user.organisation,
				image: image || 'images/profile-placeholder.png'
			});

			await newAdmin.save();

			return { success: true };
		} catch (error) {
			console.log('Error adding admin:\n', error);
			return fail(500, { error: 'Failed to add admin' });
		}
	},
	edit: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const id = data.get('id') as string;
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const image = data.get('image') as string;
		const surname = data.get('surname') as string;

		if (!id) return fail(400, { error: 'Admin ID is required' });

		const updateData: { [key: string]: string } = {};

		if (name !== '') updateData.name = name;
		if (email !== '') updateData.email = email;
		if (image !== '') updateData.image = image;
		if (surname !== '') updateData.surname = surname;

		try {
			const updatedAdmin = await User.findByIdAndUpdate(id, updateData, { new: true });

			if (!updatedAdmin) return fail(404, { error: 'Admin not found' });

			return { success: true };
		} catch (err) {
			console.error('Error updating admin:\n', err);
			return fail(500, { error: 'Failed to update admin' });
		}
	},
	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Admin ID is required' });

		try {
			const admin = await User.findById(id);
			let profilePic : string;
			
			if(admin){
				profilePic = admin.image; 
				await deleteFile(profilePic);
			}

			const deletedAdmin = await User.findByIdAndDelete(id);

			if (!deletedAdmin) return fail(404, { error: 'Admin not found' });

			return { success: true };

		} catch (err) {
			console.error('Error removing admin:\n', err);
			return fail(500, { error: 'Failed to remove admin' });
		}
	}
};
