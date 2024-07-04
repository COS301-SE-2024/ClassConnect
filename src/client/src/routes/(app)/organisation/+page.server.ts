import type { Actions } from './$types';
import { fail, error, redirect } from '@sveltejs/kit';

import User from '$db/schemas/User';
import Organisation from '$db/schemas/Organisation';

const checkUserAuth = (user: any) => {
	if (!user) throw error(400, 'User not authenticated');
	if (user.role !== 'admin') throw error(401, 'Unauthorized access');
};

const handleServerError = (error: any) => {
	console.error('Server error:', error);
	return fail(500, { error: 'An unexpected error occurred' });
};

export async function load({ locals }) {
	if (!locals.user) return redirect(302, '/signin');

	checkUserAuth(locals.user);

	try {
		const organisation = await Organisation.findOne({ createdBy: locals.user.id });

		if (!organisation) return { id: null };

		return {
			id: organisation._id.toString(),
			name: organisation.name,
			image: organisation.image
		};
	} catch (error) {
		return handleServerError(error);
	}
}

const createOrganisation = async (request: Request, locals: any) => {
	const data = await request.formData();
	const name = data.get('name') as string;
	const image = data.get('image') as string;

	if (!name) return fail(400, { errors: 'Organisation Name is required' });

	try {
		const newOrganisation = new Organisation({
			name,
			createdBy: locals.user.id,
			image: image || 'images/organisation-placeholder.png'
		});

		await newOrganisation.save();
		await User.updateOne({ _id: locals.user.id }, { organisation: newOrganisation._id });

		locals.user.organisation = newOrganisation._id;

		return { success: true };
	} catch (error) {
		return handleServerError(error);
	}
};

const editOrganisation = async (request: Request, locals: any) => {
	const data = await request.formData();
	const id = data.get('id') as string;
	const name = data.get('name') as string;
	const image = data.get('image') as string;

	try {
		const organisation = await Organisation.findById(id);

		if (!organisation) return fail(404, { error: 'Organisation not found' });

		if (organisation.createdBy.toString() !== locals.user.id.toString()) {
			return fail(403, { error: 'Not authorized to update this organisation' });
		}

		organisation.name = name || organisation.name;
		organisation.image = image || organisation.image;

		await organisation.save();

		return { success: true };
	} catch (error) {
		return handleServerError(error);
	}
};

const deleteOrganisation = async (request: Request, locals: any) => {
	const data = await request.formData();
	const id = data.get('id') as string;

	try {
		const organisation = await Organisation.findById(id).select('createdBy');

		if (!organisation) return fail(404, { error: 'Organisation not found' });

		if (organisation.createdBy.toString() !== locals.user.id.toString()) {
			return fail(403, { error: 'Not authorized to delete this organisation' });
		}

		await Organisation.deleteOne({ _id: id });
		await User.updateOne({ _id: locals.user.id }, { $unset: { organisation: '' } });
		await User.deleteMany({ organisation: id });

		locals.user.organisation = '';

		return { success: true };
	} catch (error) {
		return handleServerError(error);
	}
};

export const actions: Actions = {
	create: async ({ request, locals }) => {
		checkUserAuth(locals.user);
		return createOrganisation(request, locals);
	},
	edit: async ({ request, locals }) => {
		checkUserAuth(locals.user);
		return editOrganisation(request, locals);
	},
	delete: async ({ request, locals }) => {
		checkUserAuth(locals.user);
		return deleteOrganisation(request, locals);
	}
};
