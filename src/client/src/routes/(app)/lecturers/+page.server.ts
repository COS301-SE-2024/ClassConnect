import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import type { ObjectId } from 'mongoose';
import { fail, error } from '@sveltejs/kit';

import User from '$db/schemas/User';
import type { Lecturer } from '$src/types';
import { HASH_OPTIONS } from '$src/constants';
import { generateUsername } from '$utils/user';

function formatLecturer(lecturer: any): Lecturer {
	return {
		id: lecturer._id.toString(),
		name: lecturer.name,
		email: lecturer.email,
		image: lecturer.image,
		surname: lecturer.surname,
		username: lecturer.username
	};
}

async function getLecturers(organisation: ObjectId): Promise<Lecturer[]> {
	const lecturers = await User.find({ role: 'lecturer', organisation });

	return lecturers.map(formatLecturer);
}

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') throw error(401, 'Only admins can access this page');

	try {
		const lecturers = await getLecturers(locals.user.organisation);

		return { lecturers };
	} catch (e) {
		console.error('Failed to load lecturers:', e);
		throw error(500, 'Error occurred while fetching lecturers');
	}
}

function validateAdmin(locals: any) {
	if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');
}

async function addLecturer(data: FormData, organisation: ObjectId) {
	const name = data.get('name') as string;
	const email = data.get('email') as string;
	const image = data.get('image') as string;
	const surname = data.get('surname') as string;

	const existingUser = await User.findOne({ email });
	if (existingUser) return fail(400, { error: 'Email already in use' });

	const username = generateUsername('lecturer', email);
	const hashedPassword = await hash(username, HASH_OPTIONS);

	const newLecturer = new User({
		name,
		email,
		surname,
		username,
		organisation,
		role: 'lecturer',
		password: hashedPassword,
		image: image || '/images/profile-placeholder.png'
	});

	await newLecturer.save();

	return { success: true };
}

async function editLecturer(data: FormData) {
	const id = data.get('id') as string;
	if (!id) return fail(400, { error: 'Lecturer ID is required' });

	const updateData: Partial<Lecturer> = {};

	['name', 'email', 'image', 'surname'].forEach((field) => {
		const value = data.get(field) as string;

		if (value !== '') updateData[field as keyof Partial<Lecturer>] = value;
	});

	const updatedLecturer = await User.findByIdAndUpdate(id, updateData, { new: true });
	if (!updatedLecturer) return fail(404, { error: 'Lecturer not found' });

	return { success: true };
}

async function deleteLecturer(id: string) {
	if (!id) return fail(400, { error: 'Lecturer ID is required' });

	const deletedLecturer = await User.findByIdAndDelete(id);
	if (!deletedLecturer) return fail(404, { error: 'Lecturer not found' });

	return { success: true };
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();

			return await addLecturer(data, locals.user?.organisation!);
		} catch (error) {
			console.error('Error adding lecturer:', error);
			return fail(500, { error: 'Failed to add lecturer' });
		}
	},
	edit: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();

			return await editLecturer(data);
		} catch (err) {
			console.error('Error updating lecturer:', err);
			return fail(500, { error: 'Failed to update lecturer' });
		}
	},
	delete: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();
			const id = data.get('id') as string;

			return await deleteLecturer(id);
		} catch (err) {
			console.error('Error removing lecturer:', err);
			return fail(500, { error: 'Failed to remove lecturer' });
		}
	}
};
