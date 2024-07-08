import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';

import User from '$db/schemas/User';
import Workspace from '$db/schemas/Workspace';
import { HASH_OPTIONS } from '$src/constants';
import { generateUsername } from '$utils/user';

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') throw error(401, 'Unauthorised');

	try {
		const students = await User.find({ role: 'student', organisation: locals.user.organisation });

		const workspaces = await Workspace.find({ organisation: locals.user.organisation });

		const formattedWorkspaces = workspaces.map((workspace) => ({
			id: workspace._id.toString(),
			name: workspace.name,
			image: workspace.image,
			description: workspace.description
		}));

		const formattedStudents = students.map((student) => ({
			id: student._id.toString(),
			name: student.name,
			email: student.email,
			image: student.image,
			surname: student.surname,
			username: student.username
		}));

		return {
			students: formattedStudents,
			workspaces: formattedWorkspaces
		};
	} catch (error) {
		console.error('Failed to load Students:\n', error);
		return fail(500, { error: 'An unexpected error occurred while fetching students' });
	}
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const name = data.get('name') as string;
		const email = data.get('email') as string;
		const image = data.get('image') as string;
		const surname = data.get('surname') as string;

		try {
			const existingUser = await User.findOne({ email });
			if (existingUser) return fail(400, { error: 'Email already in use' });

			const username = generateUsername('student', email);
			const hashedPassword = await hash(username, HASH_OPTIONS);

			const newStudent = new User({
				name,
				email,
				surname,
				username,
				role: 'student',
				password: hashedPassword,
				organisation: locals.user.organisation,
				image: image || 'images/profile-placeholder.png'
			});

			await newStudent.save();

			return { success: true };
		} catch (error) {
			console.log('Failed to add Students:\n', error);
			return fail(500, { error: 'An unexpected error occurred while adding student' });
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

		if (!id) return fail(400, { error: 'Student ID is required' });
		const updateData: { [key: string]: string } = {};

		if (name !== '') updateData.name = name;
		if (surname !== '') updateData.surname = surname;
		if (email !== '') updateData.email = email;
		if (image !== '') updateData.image = image;

		try {
			const updatedStudent = await User.findByIdAndUpdate(id, updateData, { new: true });

			if (!updatedStudent) return fail(404, { error: 'Student not found' });

			return { success: true };
		} catch (error) {
			console.error('Error updating Student:', error);
			return fail(500, { error: 'Error occurred while updating admins' });
		}
	},
	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Student ID is required' });

		try {
			const deletedStudent = await User.findByIdAndDelete(id);

			if (!deletedStudent) return fail(404, { error: 'Student not found' });

			return { success: true };
		} catch (error) {
			console.error('Error removing student:', error);
			return fail(500, { error: 'Failed to remove student' });
		}
	},
	enrol: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorized');

		const data = await request.formData();
		const studentId = data.get('id') as string;
		const selectedWorkspaces = data.getAll('workspaces') as string[];

		try {
			const student = await User.findByIdAndUpdate(
				studentId,
				{ $addToSet: { workspaces: { $each: selectedWorkspaces } } },
				{ new: true, runValidators: true }
			);

			if (!student) return fail(404, { error: 'Student not found' });

			return { success: true };
		} catch (err) {
			console.error('Error while enroling student:\n', err);
			return fail(500, { error: 'Failed to enrol student' });
		}
	}
};
