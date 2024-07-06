import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { generateUsername } from '$utils/user';
import User from '$db/schemas/User';
import Workspace from '$db/schemas/Workspace';
//import { Workspace } from '../../../../../server/workspace/dist/schemas/workspace.schema.js';
//import { orgID } from '../../../lib/store/index.ts';

const HASH_OPTIONS = {
	timeCost: 2,
	outputLen: 32,
	parallelism: 1,
	memoryCost: 19456
};

export async function load({ locals }) {
	//handle user
	if (!locals.user) return redirect(302, '/signin');
	if (locals.user.role !== 'admin') throw error(401, 'Unathorised');

	//find all students in organisation
	try {
		const students = await User.find({
			role: 'student',
			organisation: locals.user.organisation
		}).select('name surname username email image');

		const workspaces = await Workspace.find({organisation: locals.user.organisation})

		const formattedWorkspaces = workspaces.map((workspace) => ({
			id: workspace._id.toString(),
			name: workspace.name,
			image: workspace.image,
			description: workspace.description
		}));

		const formatStudents = students.map((student) => ({
			id: student._id.toString(),
			name: student.name,
			surname: student.surname,
			username: student.username,
			email: student.email,
			image: student.image
		}));
		return {
			students: formatStudents,
			workspaces: formattedWorkspaces
		};
	} catch (error) {
		console.error('Failed to load data', error);
		return fail(500, { error: 'An unexpected error occurred while fetching students' });
	}
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		///check for unauthorised accesss
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unathorised');

		//retrieve information from form data
		const data = await request.formData();
		const name = data.get('name') as string;

		const surname = data.get('surname') as string;
		const email = data.get('email') as string;
		const image = data.get('image') as string;

		//create new admin and save
		try {
			//if user already exists

			//generate username
			const username = generateUsername('student', email);
			const hashedPassword = await hash(username, HASH_OPTIONS);

			const newStudent = new User({
				name,
				surname,
				email,
				username,
				role: 'student',
				password: hashedPassword,
				organisation: locals.user.organisation,
				image: image || 'images/profile-placeholder.png'
			});

			await newStudent.save();
			return {
				success: true
			};
		} catch (error) {
			console.log('Server error:', error);
			return fail(500, { error: 'Failed to create student' });
		}
	},

	edit: async ({ request, locals }) => {
		///check for unauthorised accesss
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unathorised');

		//retrieve information from form data
		const data = await request.formData();
		const name = data.get('name') as string;
		const id = data.get('id') as string;
		const surname = data.get('surname') as string;
		const email = data.get('email') as string;
		const image = data.get('image') as string;

		try {
			if (!id) return fail(400, { error: 'Student ID is required' });
			const updateData: { [key: string]: string } = {};

			if (name !== '') updateData.name = name;
			if (surname !== '') updateData.surname = surname;
			if (email !== '') updateData.email = email;
			if (image !== '') updateData.image = image;

			const updatedStudent = await User.findByIdAndUpdate(id, updateData, { new: true });

			if (!updatedStudent) return fail(404, { error: 'Student not found' });

			return { success: true };
		} catch (err) {
			console.error('Error updating Student:', err);
			return fail(500, { error: 'Failed to update student' });
		}
	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorized');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Student ID is required' });

		try {
			const deletedStudent = await User.findByIdAndDelete(id);

			if (!deletedStudent) return fail(404, { error: 'Student not found' });

			return { success: true };
		} catch (err) {
			console.error('Error removing student:', err);
			return fail(500, { error: 'Failed to remove student' });
		}
	},

	enrol: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorized');

		// get information from form data
		const data = await request.formData();
		const studentId = data.get('id') as string;
		const selectedWorkspaces = data.getAll('workspaces') as string[];
		console.log('Selected workspaces:', selectedWorkspaces);

		try {
			// Find the student and update their workspaces
			const result = await User.findByIdAndUpdate(
				studentId,
				{ $addToSet: { workspaces: { $each: selectedWorkspaces } } },
				{ new: true, runValidators: true }
			);

			if (!result) {
				console.log('Student not found');
				return fail(404, { error: 'Student not found' });
			}

			console.log('Student enrolled successfully');
			return { success: true };
		} catch (err) {
			console.error('Server error:', err);
			return fail(500, { error: 'Failed to enrol student' });
		}
	}
};
