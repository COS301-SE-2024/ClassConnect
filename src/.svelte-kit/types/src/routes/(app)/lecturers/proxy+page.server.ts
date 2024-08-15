// @ts-nocheck
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

import { addUser, getUsers, editUser, deleteUser, validateUser } from '$src/lib/server/utils/users';

export async function load({ locals }) {
	validateUser(locals, 'admin');

	try {
		const lecturers = await getUsers('lecturer', locals.user?.organisation);
		let organisation;
		if (locals.user?.organisation) {
			organisation = JSON.parse(JSON.stringify(locals.user?.organisation));
		}

		return { lecturers, organisation };
	} catch (e) {
		console.error('Failed to load lecturers:', e);
		throw error(500, 'Error occurred while fetching lecturers');
	}
}

export const actions = {
	add: async ({ request, locals }: import('./$types').RequestEvent) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			return await addUser(data, locals.user?.organisation, 'lecturer');
		} catch (error) {
			console.error('Error adding lecturer:', error);
			return fail(500, { error: 'Failed to add lecturer' });
		}
	},

	edit: async ({ request, locals }: import('./$types').RequestEvent) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			return await editUser(data);
		} catch (err) {
			console.error('Error updating lecturer:', err);
			return fail(500, { error: 'Failed to update lecturer' });
		}
	},

	delete: async ({ request, locals }: import('./$types').RequestEvent) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			const id = data.get('id') as string;
			return await deleteUser(id);
		} catch (err) {
			console.error('Error removing lecturer:', err);
			return fail(500, { error: 'Failed to remove lecturer' });
		}
	}
};
;null as any as Actions;