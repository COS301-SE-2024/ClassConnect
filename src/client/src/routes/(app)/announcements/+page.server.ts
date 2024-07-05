import type { Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import User from '$db/schemas/User';
import Announcement from '$db/schemas/Annoucement';

export async function load({locals}) {
	//handle user
	if (!locals.user) return redirect(302, '/signin');
	if (locals.user.role !== 'admin') throw error(401, 'Unathorised');

	//find all announcements in organisation
	try{

		const announcements = await Announcement.find({
			ID: locals.user.organisation

		}).select('title description date type ID');

		//format results
		const formattedAnn = announcements.map((announcements)=>({
			title: announcements.title,
			
			description: announcements.description,
			date: announcements.date,
			type: announcements.type,
			id: announcements.ID.toString(),
			ann_id: announcements._id.toString(),
		}));
		
		console.log('these are ann', formattedAnn);
		return {
			announcements: formattedAnn
		};

	}
	catch(error){
		console.error('Failed to fetch announcements: ', error);
		return fail(500, { error: 'An unexpected error occurred while fetching announcements' });
	}
}

export const actions: Actions ={
	add: async ({request, locals})=>{
		///check for unauthorised accesss
		if (!locals.user || locals.user.role !== 'admin' ) throw error(401, 'Unathorised');

		//retrieve information from form data
		const data= await request.formData();
		const title= data.get('title') as string;
		const description= data.get('description') as string;
		const date= data.get('date') as string;
		const type='global';

		//create new announcement and save 
		try{
			
			const newAnnouncement = new Announcement({
				title,
				description,
				date,
				type,
				createdBy: locals.user.id,
				ID: locals.user.organisation
			});

			await newAnnouncement.save();
			console.log('Saved successfully');
			return{
				success: true
			};
		}
		
		catch(error){
			console.log('Server error:', error);
			return fail(500, {error: 'Failed to create announcement'});
		}
	}
}