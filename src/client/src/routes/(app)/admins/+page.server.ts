import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import type { ObjectId } from 'mongoose';
import { fail, error } from '@sveltejs/kit';
import { upload, deleteFile } from '$lib/server/s3Bucket';

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

	try {
		const admins = await getAdmins(locals.user.organisation);

		return { admins };
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
	let image: string = 'https://class-connect-file-storage.s3.amazonaws.com/pictures/default.svg';
	const surname = data.get('surname') as string;

	const existingUser = await Users.findOne({ email });
	if (existingUser) return fail(400, { error: 'Email already in use' });

	if (image_file && image_file.size !== 0) {
		image = await upload(image_file)
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
  if (!id) return fail(400, { error: 'Admin ID is required' });

  const existingUser = await Users.findById(id);
  if (!existingUser) return fail(404, { error: 'Admin not found' });

  const updateData: Partial<User> = {};

  const name = data.get('name') as string;
  const email = data.get('email') as string;
  const image_file: File = data.get('file') as File;
  let image: string | undefined;
  const surname = data.get('surname') as string;
  
  if (name !== '' && email !== '' && surname !== '') {
    updateData.name = name;
    updateData.email = email;
    updateData.surname = surname;
  }

  if (image_file && image_file.size !== 0) {
    console.log("Image File Details: " + image_file);
    image = await upload(image_file);
    console.log("Image details: " + image);
    if (image) {
      // Delete the existing image if it's not the default image
      if (existingUser.image && existingUser.image !== 'https://class-connect-file-storage.s3.amazonaws.com/pictures/default.svg') {
        await deleteFile(existingUser.image);
      }
      updateData.image = image;
    }
  }

  const updatedAdmin = await Users.findByIdAndUpdate(id, updateData, { new: true });
  if (!updatedAdmin) return fail(404, { error: 'Admin not found' });

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
