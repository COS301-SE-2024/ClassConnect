import type { Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { generateUsername } from '$utils/user';
import User from '$db/schemas/User';
import Announcement from '$db/schemas/Annoucement';

export async function load({locals}) {
	//handle user
	if (!locals.user) return redirect(302, '/signin');
	if (locals.user.role !== 'admin') throw error(401, 'Unathorised');

	//find all announcements in organisation
	try{

		const announcements = await Announcement.find({
			organisation: locals.user.organisation

		}).select('topic description date type ID');

		//format results
		const formattedAnn = announcements.map((announcements)=>({
			topic: announcements.topic,
			description: announcements.description,
			date: announcements.date,
			type: announcements.type,
			id: announcements.ID.toString(),
			ann_id: announcements._id.toString(),
		}));

		return {
			announcements: formattedAnn
		};

	}
	catch(error){
		console.error('Failed to fetch announcements: ', error);
		return fail(500, { error: 'An unexpected error occurred while fetching announcements' });
	}
}
