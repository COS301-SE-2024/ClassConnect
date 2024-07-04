import type { Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';

import User from '$db/schemas/User';

export async function load({ locals }) {
	//handle user
	if (!locals.user) return redirect(302, '/signin');
	if (locals.user.role !== 'admin') throw error(401, 'Unathorised');


	//find all admins in organisation
	try{
		const admins= await User.find({
			role: 'admin',
			organisation: locals.user.organisation
		}).select('_id name surname username email image');
	

		const formatAdmins= admins.map((admin)=>(
			{
				id: admin._id.toString(),
				name: admin.name,
				surname: admin.surname,
				username: admin.username,
				email: admin.email,
				image: admin.image
			}));
		return{
			admins: formatAdmins
		};
	}
	catch (error){
		console.error('Failed to load data', error);
		return fail(500, { error: 'An unexpected error occurred while fetching admins' });
	}
}
