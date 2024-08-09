import { hash } from '@node-rs/argon2';
import type { Actions } from './$types';
import type { ObjectId } from 'mongoose';
import { fail, error } from '@sveltejs/kit';

import Users from '$db/schemas/User';
import Workspaces from '$db/schemas/Workspace';
import { HASH_OPTIONS } from '$src/constants';
import { generateUsername } from '$utils/user';
import type { User, Workspace } from '$src/types';

function formatStudent(student: any): User {
	return {
		id: student._id.toString(),
		name: student.name,
		email: student.email,
		image: student.image,
		surname: student.surname,
		username: student.username
	};
}

function formatWorkspace(workspace: any): Workspace {
	return {
		id: workspace._id.toString(),
		name: workspace.name,
		image: workspace.image,
		description: workspace.description,
		owner: workspace.owner?.toString() || ''
	};
}

async function getStudents(organisation: ObjectId): Promise<User[]> {
	const students = await Users.find({ role: 'student', organisation });

	return students.map(formatStudent);
}

async function getWorkspaces(organisation: ObjectId): Promise<Workspace[]> {
	const workspaces = await Workspaces.find({ organisation });

	return workspaces.map(formatWorkspace);
}

export async function load({ locals }) {
	if (locals.user?.role !== 'admin') throw error(401, 'Only admins can access this page');

	try {
		const students = await getStudents(locals.user.organisation);
		const workspaces = await getWorkspaces(locals.user.organisation);

		let organisation;
		if(locals.user?.organisation) {
			organisation = JSON.parse(JSON.stringify(locals.user?.organisation));
		}

		return { students, workspaces,
			organisation
		 };
	} catch (e) {
		console.error('Failed to load students:', e);
		throw error(500, 'Error occurred while fetching students');
	}
}

function validateAdmin(locals: any) {
	if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');
}

async function addStudent(data: FormData, organisation: ObjectId | undefined) {
	const name = data.get('name') as string;
	const email = data.get('email') as string;
	const image = 'https://class-connect-file-storage.s3.amazonaws.com/pictures/default.svg';
	const surname = data.get('surname') as string;

	const existingUser = await Users.findOne({ email });
	if (existingUser) return fail(400, { error: 'Email already in use' });

	const username = generateUsername('student', email);
	const hashedPassword = await hash(username, HASH_OPTIONS);

	const newStudent = new Users({
		name,
		email,
		surname,
		username,
		organisation,
		role: 'student',
		password: hashedPassword,
		image: image || 'images/profile-placeholder.png'
	});

	await newStudent.save();

	return { success: true };
}

async function editStudent(data: FormData) {
	const id = data.get('id') as string;
	if (!id) return fail(400, { error: 'Student ID is required' });

	const updateData: Partial<User> = {};

	['name', 'email', 'image', 'surname'].forEach((field) => {
		const value = data.get(field) as string;
		if (value !== '') updateData[field as keyof Partial<User>] = value;
	});

	const updatedStudent = await Users.findByIdAndUpdate(id, updateData, { new: true });
	if (!updatedStudent) return fail(404, { error: 'Student not found' });

	return { success: true };
}

async function deleteStudent(id: string) {
	if (!id) return fail(400, { error: 'Student ID is required' });

	const deletedStudent = await Users.findByIdAndDelete(id);
	if (!deletedStudent) return fail(404, { error: 'Student not found' });

	return { success: true };
}

async function enrolStudent(studentId: string, workspaces: string[]) {
	const student = await Users.findByIdAndUpdate(
		studentId,
		{ $addToSet: { workspaces: { $each: workspaces } } },
		{ new: true, runValidators: true }
	);

	if (!student) return fail(404, { error: 'Student not found' });

	return { success: true };
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();

			return await addStudent(data, locals.user?.organisation);
		} catch (error) {
			console.error('Error adding student:', error);
			return fail(500, { error: 'Failed to add student' });
		}
	},
	edit: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();

			return await editStudent(data);
		} catch (err) {
			console.error('Error updating student:', err);
			return fail(500, { error: 'Failed to update student' });
		}
	},
	delete: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();
			const id = data.get('id') as string;

			return await deleteStudent(id);
		} catch (err) {
			console.error('Error removing student:', err);
			return fail(500, { error: 'Failed to remove student' });
		}
	},
	enrol: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();
			const studentId = data.get('id') as string;

			const selectedWorkspaces = data.getAll('workspaces') as string[];

			return await enrolStudent(studentId, selectedWorkspaces);
		} catch (err) {
			console.error('Error while enrolling student:', err);
			return fail(500, { error: 'Failed to enrol student' });
		}
	}
};
