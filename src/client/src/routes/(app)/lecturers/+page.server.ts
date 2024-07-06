import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';

import User from '$db/schemas/User';
import { HASH_OPTIONS } from '$src/constants';
import { generateUsername } from '$utils/user';

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') throw error(401, 'Unauthorised');

	try {
		const lecturers = await User.find({
			role: 'lecturer',
			organisation: locals.user.organisation
		});

		const formattedLecturers = lecturers.map((lecturer) => ({
			id: lecturer._id.toString(),
			name: lecturer.name,
			surname: lecturer.surname,
			username: lecturer.username,
			email: lecturer.email,
			image: lecturer.image
		}));

		return {
			lecturers: formattedLecturers
		};
	} catch (error) {
		console.error('Failed to load lecturers:\n', error);
		return fail(500, { error: 'An unexpected error occurred while fetching lecturers' });
	}
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const name = data.get('name') as string;
		const surname = data.get('surname') as string;
		const email = data.get('email') as string;
		const image = data.get('image') as string;

		try {
			const existingUser = await User.findOne({ email });

			if (existingUser) return fail(400, { error: 'Email already in use' });

			const username = generateUsername('lecturer', email);
			const hashedPassword = await hash(username, HASH_OPTIONS);

			const newLecturer = new User({
				name,
				surname,
				email,
				username,
				role: 'lecturer',
				password: hashedPassword,
				organisation: locals.user.organisation,
				image: image || 'images/profile-placeholder.png'
			});

			await newLecturer.save();

			return { success: true };
		} catch (error) {
			console.error('Failed to load lecturers:\n', error);
			return fail(500, { error: 'Failed to add lecturer' });
		}
	},
	edit: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const id = data.get('id') as string;
		const name = data.get('name') as string;
		const surname = data.get('surname') as string;
		const email = data.get('email') as string;
		const image = data.get('image') as string;

		if (!id) return fail(400, { error: 'Lecturer ID is required' });

		const updateData: { [key: string]: string } = {};

		if (name !== '') updateData.name = name;
		if (email !== '') updateData.email = email;
		if (image !== '') updateData.image = image;
		if (surname !== '') updateData.surname = surname;

		try {
			const updatedLecturer = await User.findByIdAndUpdate(id, updateData, { new: true });

			if (!updatedLecturer) return fail(404, { error: 'Lecturer not found' });

			return { success: true };
		} catch (error) {
			console.error('Error updating lecturer:', error);
			return fail(500, { error: 'Failed to update lecturer' });
		}
	},
	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Lecturer ID is required' });

		try {
			const deletedLecturer = await User.findByIdAndDelete(id);

			if (!deletedLecturer) return fail(404, { error: 'Lecturer not found' });

			return { success: true };
		} catch (err) {
			console.error('Error removing lecturer:', err);
			return fail(500, { error: 'Failed to remove lecturer' });
		}
	}
};
