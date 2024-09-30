import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

import {
	addUser,
	getUsers,
	addUsers,
	editUser,
	deleteUser,
	validateUser
} from '$src/lib/server/utils/users';

export async function load({ locals }) {
	validateUser(locals, 'admin');

	try {
		const admins = await getUsers('admin', locals.user?.organisation);
		let organisation;
		if (locals.user?.organisation) {
			organisation = JSON.parse(JSON.stringify(locals.user?.organisation));
		}
		return { organisation, admins };
	} catch (e) {
		console.error('Failed to load admins:', e);
		throw error(500, 'Error occurred while fetching admins');
	}
}

export const actions: Actions = {
	add: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			return await addUser(data, locals.user?.organisation, 'admin');
		} catch (error) {
			console.error('Error adding admin:', error);
			return fail(500, { error: 'Failed to add admin' });
		}
	},

	addMulti: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			const file = data.get('csv') as File;
			return await addUsers(file, locals.user?.organisation, 'admin');
		} catch (error) {
			console.error('Error adding student:', error);
			return fail(500, { error: 'Failed to add admins' });
		}
	},

	edit: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			return await editUser(data);
		} catch (err) {
			console.error('Error updating admin:', err);
			return fail(500, { error: 'Failed to update admin' });
		}
	},

	delete: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			const id = data.get('id') as string;
			return await deleteUser(id);
		} catch (err) {
			console.error('Error removing admin:', err);
			return fail(500, { error: 'Failed to remove admin' });
		}
	}
};
