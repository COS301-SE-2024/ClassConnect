import type { Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';

import User from '$db/schemas/User';
import { generateUsername } from '$utils/user';

export async function load({ locals }) {
	if (!locals.user) return redirect(302, '/signin');
	if (locals.user.role !== 'admin') throw error(401, 'Unauthorized');

	try {
		const lecturers = await User.find({
			role: 'lecturer',
			organisation: locals.user.organisation
		}).select('_id name surname username email image');

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
		console.error('Server error:', error);
		return fail(500, { error: 'An unexpected error occurred while fetching lecturers' });
	}
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorized');

		const data = await request.formData();
		const name = data.get('name') as string;
		const surname = data.get('surname') as string;
		const email = data.get('email') as string;
		const image = data.get('image') as string;

		try {
			const existingUser = await User.findOne({ email });

			if (existingUser) return fail(400, { error: 'Email already in use' });

			const username = generateUsername('lecturer', email);

			const newLecturer = new User({
				name,
				surname,
				email,
				username,
				role: 'lecturer',
				password: username,
				organisation: locals.user.organisation,
				image: image || 'images/profile-placeholder.png'
			});

			await newLecturer.save();

			return { success: true };
		} catch (error) {
			console.error('Server error:', error);
			return fail(500, { error: 'Failed to add lecturer' });
		}
	},
	edit: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorized');

		const data = await request.formData();
		const id = data.get('id') as string;
		const name = data.get('name') as string;
		const surname = data.get('surname') as string;
		const email = data.get('email') as string;
		const image = data.get('image') as string;

		if (!id) return fail(400, { error: 'Lecturer ID is required' });

		try {
			const updateData: { [key: string]: string } = {};

			if (name !== '') updateData.name = name;
			if (surname !== '') updateData.surname = surname;
			if (email !== '') updateData.email = email;
			if (image !== '') updateData.image = image;

			const updatedLecturer = await User.findByIdAndUpdate(id, updateData, { new: true });

			if (!updatedLecturer) return fail(404, { error: 'Lecturer not found' });

			return { success: true };
		} catch (err) {
			console.error('Error updating lecturer:', err);
			return fail(500, { error: 'Failed to update lecturer' });
		}
	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorized');

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
