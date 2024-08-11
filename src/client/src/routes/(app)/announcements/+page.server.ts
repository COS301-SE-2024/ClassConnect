import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';

import {
	validateUser,
	addAnnouncement,
	getAnnouncements,
	editAnnouncement,
	deleteAnnouncement
} from '$lib/server/utils/announcements';

export async function load({ locals }) {
	try {
		const announcements = await getAnnouncements(locals.user?.organisation);

		return { announcements, id: locals.user?.id.toString(), role: locals.user?.role };
	} catch (e) {
		console.error('Failed to load announcements:', e);
		throw error(500, 'Error occurred while fetching announcements');
	}
}

export const actions: Actions = {
	post: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			return await addAnnouncement(data, locals.user?.organisation);
		} catch (error) {
			console.error('Error adding announcement:', error);
			return fail(500, { error: 'Failed to add announcement' });
		}
	},
	edit: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			return await editAnnouncement(data);
		} catch (err) {
			console.error('Error updating announcement:', err);
			return fail(500, { error: 'Failed to update announcement' });
		}
	},
	delete: async ({ request, locals }) => {
		validateUser(locals, 'admin');

		try {
			const data = await request.formData();
			const id = data.get('id') as string;

			return await deleteAnnouncement(id);
		} catch (err) {
			console.error('Error removing announcement:', err);
			return fail(500, { error: 'Failed to remove announcement' });
		}
	}
};
