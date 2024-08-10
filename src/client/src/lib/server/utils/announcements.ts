import type { ObjectId } from 'mongoose';
import { error } from '@sveltejs/kit';

import Announcements from '$db/schemas/Announcement';

export function formatAnnouncement(announcement: any): Announcement {
	return {
		title: announcement.title,
		content: announcement.content,
		id: announcement._id.toString(),
		date: announcement.date.toISOString(),
		createdBy: announcement.createdBy.name + ' ' + announcement.createdBy.surname
	};
}

export async function getAnnouncements(
	ownerID: ObjectId | string | undefined
): Promise<Announcement[]> {
	const announcements = await Announcements.find({ owner: ownerID }).populate('createdBy');

	return announcements.map(formatAnnouncement);
}

export function validateUser(locals: any, requiredRole: string) {
	if (!locals.user || locals.user.role !== requiredRole) {
		throw error(401, `Only ${requiredRole}s can access this page`);
	}
}

export async function addAnnouncement(data: FormData, organisation: ObjectId | string | undefined) {
	const title = data.get('title') as string;
	const content = data.get('content') as string;
	const createdBy = data.get('createdBy') as string;

	const newAnnouncement = new Announcements({
		title,
		content,
		createdBy,
		owner: organisation
	});

	await newAnnouncement.save();

	return { success: true };
}

export async function editAnnouncement(data: FormData) {
	const id = data.get('id') as string;
	const updateData: Partial<Announcement> = {};

	['title', 'content'].forEach((field) => {
		const value = data.get(field) as string;

		if (value && value !== '') updateData[field as keyof Announcement] = value;
	});

	await Announcements.findByIdAndUpdate(id, updateData);

	return { success: true };
}

export async function deleteAnnouncement(id: string) {
	await Announcements.findByIdAndDelete(id);

	return { success: true };
}
