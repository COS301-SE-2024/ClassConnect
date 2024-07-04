import type { Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';
import { generateUsername } from '$utils/user';
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

export const actions: Actions ={
	add: async ({request, locals})=>{
		///check for unauthorised accesss
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unathorised');

		//retrieve information from form data
		const data= await request.formData();
		const name= data.get('name') as string;
		
		const surname= data.get('surname') as string;
		const email= data.get('email') as string;
		const image= data.get('image') as string;
		
		//create new admin and save 
		try{
			//if user already exists
			
			//generate username
			const username = generateUsername('admin', email);
			
			const newAdmin = new User({
				name,
				surname,
				email,
				role: 'admin',
				password: username,
				organisation: locals.user.organisation,
				image: image || 'images/profile-placeholder.png'
			});

			await newAdmin.save();
			return{
				success: true
			};
		}
		
		catch(error){
			console.log('Server error:', error);
			return fail(500, 'Failed to create admin');
		}
	},
	
	edit: async ({request, locals})=>{
		///check for unauthorised accesss
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unathorised');
		
		//retrieve information from form data
		const data= await request.formData();
		const name= data.get('name') as string;
		const id= data.get('id') as string;
		const surname= data.get('surname') as string;
		const email= data.get('email') as string;
		const image= data.get('image') as string;
		
		
		try {
			if (!id) return fail(400, { error: 'Admin ID is required' });
			const updateData: { [key: string]: string } = {};

			if (name !== '') updateData.name = name;
			if (surname !== '') updateData.surname = surname;
			if (email !== '') updateData.email = email;
			if (image !== '') updateData.image = image;

			const updatedAdmin = await User.findByIdAndUpdate(id, updateData, { new: true });

			if (!updatedAdmin) return fail(404, { error: 'Admin not found' });

			return { success: true };
		} catch (err) {
			console.error('Error updating Admin:', err);
			return fail(500, { error: 'Failed to update admin' });
		}

	},

	delete: async ({ request, locals }) => {
		if (!locals.user || locals.user.role !== 'admin') throw error(401, 'Unauthorized');

		const data = await request.formData();
		const id = data.get('id') as string;

		if (!id) return fail(400, { error: 'Admin ID is required' });

		try {
			const deletedAdmin = await User.findByIdAndDelete(id);

			if (!deletedAdmin) return fail(404, { error: 'Admin not found' });

			return { success: true };
		} catch (err) {
			console.error('Error removing admin:', err);
			return fail(500, { error: 'Failed to remove admin' });
		}
	}
}
