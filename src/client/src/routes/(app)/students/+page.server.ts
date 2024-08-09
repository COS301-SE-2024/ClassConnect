import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

import { addUser, getUsers, editUser, deleteUser, validateUser } from '$src/lib/server/utils/users';

export async function load({ locals }) {
	validateUser(locals, 'admin');

	try {
		const students = await getUsers('student', locals.user?.organisation);
		return { students };
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
