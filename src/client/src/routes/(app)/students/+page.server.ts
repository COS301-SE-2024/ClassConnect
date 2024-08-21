import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

import User from '$db/schemas/User';
import Workspace from '$db/schemas/Workspace';
import { addUser, getUsers, editUser, deleteUser, validateUser } from '$src/lib/server/utils/users';

function formatWorkspace(workspace: any) {
	return {
		name: workspace.name,
		image: workspace.image,
		id: workspace._id.toString()
	};
}

export async function load({ locals }) {
	validateUser(locals, 'admin');

	try {
		const students = await getUsers('student', locals.user?.organisation);
		const workspaces = await Workspace.find({ organisation: locals.user?.organisation }).select(
			'name image'
		);
		let organisation;
		if (locals.user?.organisation) {
			organisation = JSON.parse(JSON.stringify(locals.user?.organisation));
		}

		const formattedWorkspaces = workspaces.map(formatWorkspace);

		return { students, workspaces: formattedWorkspaces, organisation };
	} catch (e) {
		console.error('Failed to load students:', e);
		throw error(500, 'Error occurred while fetching students');
	}
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			return await addUser(data, locals.user?.organisation, 'student');
		} catch (error) {
			console.error('Error adding student:', error);
			return fail(500, { error: 'Failed to add student' });
		}
	},

	edit: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			return await editUser(data);
		} catch (err) {
			console.error('Error updating student:', err);
			return fail(500, { error: 'Failed to update student' });
		}
	},

	enrol: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		const data = await request.formData();
		const id = data.get('id') as string;
		const selectedWorkspaces = data.getAll('workspaces') as string[];

		try {
			await User.findByIdAndUpdate(
				id,
				{ $addToSet: { workspaces: { $each: selectedWorkspaces } } },
				{ new: true, runValidators: true }
			);

			return { success: true };
		} catch (err) {
			console.error('Error enrolling student:', err);
			return fail(500, { error: 'Failed to enrol student' });
		}
	},

	unenrol: async({ request, locals}) => {
		validateUser(locals,'admin');

		const data = await request.formData();
		const id = data.get('id') as string;
		const selectedWorkspaces = data.getAll('workspaces') as string[];

		try {
			await User.findByIdAndUpdate(
				id,
			{$pull: {workspaces: {$in: selectedWorkspaces}}},
			{new: true, runValidators: true}
			);

			return { success: true };
		} catch (err) {
			console.error('Error unenrolling student:', err);
			return fail(500, { error: 'Failed to unenrol student' });
		}
	},



	delete: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			const id = data.get('id') as string;
			return await deleteUser(id);
		} catch (err) {
			console.error('Error removing student:', err);
			return fail(500, { error: 'Failed to remove student' });
		}
	}
};
