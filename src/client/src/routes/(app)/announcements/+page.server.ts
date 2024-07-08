import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';

import Announcement from '$db/schemas/Announcement';

export async function load({ locals }) {
	try {
		const announcements = await Announcement.find({ owner: locals.user?.organisation });

		const formattedAnnouncement = announcements.map((announcements) => ({
			title: announcements.title,
			id: announcements._id.toString(),
			description: announcements.description,
			date: announcements.date.toISOString(),
			createBy: announcements.createdBy.toString()
		}));

		return { announcements: formattedAnnouncement };
	} catch (error) {
		console.error('Failed to load announcements: ', error);
		return fail(500, { error: 'An unexpected error occurred while fetching announcements' });
	}
}

export const actions: Actions = {
	post: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const title = data.get('title') as string;
		const description = data.get('description') as string;

		try {
			const newAnnouncement = new Announcement({
				title,
				description,
				createdBy: locals.user.id,
				owner: locals.user.organisation
			});

			await newAnnouncement.save();

			return { success: true };
		} catch (error) {
			console.log('Error posting announcement:\n', error);
			return fail(500, { error: 'Failed to post announcement' });
		}
	},
	edit: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const id = data.get('id') as string;
		const title = data.get('title') as string;
		const description = data.get('description') as string;

		if (!id) return fail(400, { error: 'Admin ID is required' });

		const updateData: { [key: string]: string } = {};

		if (title !== '') updateData.title = title;
		if (description !== '') updateData.description = description;

		try {
			const updatedAnnouncement = await Announcement.findByIdAndUpdate(id, updateData, {
				new: true
			});

			if (!updatedAnnouncement) return fail(404, { error: 'Announcement not found' });

			return { success: true };
		} catch (err) {
			console.error('Error updating Announcement:', err);
			return fail(500, { error: 'Failed to update announcement' });
		}
	},
	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Admin ID is required' });

		try {
			const deletedAnn = await Announcement.findByIdAndDelete(id);

			if (!deletedAnn) return fail(404, { error: 'Announcement not found' });

			return { success: true };
		} catch (err) {
			console.error('Error removing announcement:', err);
			return fail(500, { error: 'Failed to remove announcement' });
		}
	}
};
