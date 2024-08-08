import type { Actions } from './$types';
import { fail, error } from '@sveltejs/kit';

import type { ObjectId } from 'mongoose';
import type { Announcement } from '$src/types';
import Announcements from '$db/schemas/Announcement';

function formatAnnouncement(announcement: any): Announcement {
	return {
		title: announcement.title,
		id: announcement._id.toString(),
		description: announcement.description,
		date: announcement.date.toISOString(),
		createdBy: announcement.createdBy.toString()
	};
}

async function getAnnouncements(ownerID: ObjectId | undefined): Promise<Announcement[]> {
	const announcements = await Announcements.find({ owner: ownerID });
	return announcements.map(formatAnnouncement);
}

export async function load({ locals }) {
	try {

		let organisation = locals.user?.organisation;
		if(organisation !== undefined || organisation !== null) {
			organisation = JSON.parse(JSON.stringify(locals.user?.organisation));
		}

		let announcements;
		if (locals.user?.organisation) {
			announcements = await getAnnouncements(locals.user?.organisation);
			console.log('OrgdIQ', locals.user?.organisation);

		}
		return {
			announcements,
			organisation
		};
	} catch (e) {
		console.error('Failed to load announcements: ', e);
		throw error(500, 'Error occurred while fetching announcements');
	}
}

async function createAnnouncement(
	title: string,
	description: string,
	userId: ObjectId | undefined,
	ownerID: ObjectId | undefined
) {
	const newAnnouncement = new Announcements({
		title,
		description,
		createdBy: userId,
		owner: ownerID
	});

	await newAnnouncement.save();

	return { success: true };
}

async function updateAnnouncement(id: string, updateData: Partial<Announcement>) {
	const updatedAnnouncement = await Announcements.findByIdAndUpdate(id, updateData, { new: true });
	if (!updatedAnnouncement) throw new Error('Announcement not found');

	return { success: true };
}

async function deleteAnnouncement(id: string) {
	const deletedAnn = await Announcements.findByIdAndDelete(id);
	if (!deletedAnn) throw new Error('Announcement not found');

	return { success: true };
}

function validateAdmin(locals: any) {
	if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorised');
}

export const actions: Actions = {
	post: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();
			const title = data.get('title') as string;
			const description = data.get('description') as string;

			return await createAnnouncement(
				title,
				description,
				locals.user?.id,
				locals.user?.organisation
			);
		} catch (error) {
			console.error('Error posting announcement:', error);
			return fail(500, { error: 'Failed to post announcement' });
		}
	},

	edit: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();
			const id = data.get('id') as string;
			if (!id) return fail(400, { error: 'Announcement ID is required' });

			const updateData: Partial<Announcement> = {};

			['title', 'description'].forEach((field) => {
				const value = data.get(field) as string;

				if (value !== '') updateData[field as keyof Announcement] = value;
			});

			return await updateAnnouncement(id, updateData);
		} catch (err) {
			console.error('Error updating Announcement:', err);
			return fail(500, { error: 'Failed to update announcement' });
		}
	},

	delete: async ({ request, locals }) => {
		validateAdmin(locals);

		try {
			const data = await request.formData();
			const id = data.get('id') as string;
			if (!id) return fail(400, { error: 'Announcement ID is required' });

			return await deleteAnnouncement(id);
		} catch (err) {
			console.error('Error removing announcement:', err);
			return fail(500, { error: 'Failed to remove announcement' });
		}
	}
};
